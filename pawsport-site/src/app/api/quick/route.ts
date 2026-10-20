import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { submitLead } from '@/lib/ghl';
import { fail, rateLimited } from '@/lib/guard';
import { CONSENT_TEXT, CONSENT_VERSION } from '@/lib/consent';

const schema = z.object({
  species: z.enum(['Cat', 'Dog', 'Other']),
  dest: z.string().trim().min(1).max(60),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  email: z.string().trim().toLowerCase().email().max(200),
  terms: z.literal(true),
  website: z.string().max(0).optional(), // honeypot: real people leave it empty
});

export async function POST(req: NextRequest) {
  if (rateLimited(req)) return fail('Too many tries. Please wait a few minutes.', 429);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail('Please check your answers and try again.');
  const d = parsed.data;
  if (new Date(d.travelDate + 'T00:00:00').getTime() <= Date.now()) return fail('Travel date must be in the future.');

  const now = new Date().toISOString();
  try {
    await submitLead({
      firstName: d.email.split('@')[0],
      email: d.email,
      tags: ['quick-inquiry', d.species.toLowerCase(), 'dest-' + d.dest.toLowerCase().replace(/\s+/g, '-')],
      fields: { pet_type: d.species, where_to: d.dest, travel_date: d.travelDate, source: 'website-quick', consent_email_at: now },
      consentNote: `Consent (quick inquiry), ${now}, text version ${CONSENT_VERSION}: "${CONSENT_TEXT.quickTerms}"`,
      source: 'Pawsport website: quick inquiry',
      opportunity: { name: `Quick inquiry: ${d.species} to ${d.dest}` },
    });
  } catch (e) {
    console.error('[quick]', e);
    return fail('We could not save that just now. Please try again in a moment.', 502);
  }
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { submitLead } from '@/lib/ghl';
import { fail, rateLimited } from '@/lib/guard';
import { CONSENT_TEXT, CONSENT_VERSION } from '@/lib/consent';

const s = (n: number) => z.string().trim().max(n);
const schema = z.object({
  who: z.enum(['Me', 'My employer']).or(s(40)),
  company: s(120).optional(),
  yourName: s(120).min(1),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: s(40).optional(),
  petName: s(80).min(1),
  species: z.enum(['Cat', 'Dog', 'Other']),
  breed: s(80),
  age: s(40),
  weight: s(20),
  wunit: z.enum(['kg', 'lb']),
  chip: s(40).optional(),
  chipUnknown: z.boolean(),
  rabiesDate: s(10).optional(),
  rabiesNone: z.boolean(),
  from: s(120).min(1),
  dest: s(60).min(1),
  destOther: s(80).optional(),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  flexible: z.boolean(),
  cEmail: z.boolean(),
  cText: z.boolean(),
  cCall: z.boolean(),
  terms: z.literal(true),
  plan: s(40).optional(),
  addons: z.array(s(60)).max(10).optional(),
  worries: z.array(s(80)).max(20).optional(),
  heard: s(80).optional(),
  conf: s(40).optional(),
  paid: z.boolean().optional(),
  website: z.string().max(0).optional(), // honeypot
}).refine((d) => d.cEmail || d.cText || d.cCall, { message: 'Pick at least one reminder channel' })
  .refine((d) => !(d.cText || d.cCall) || (d.phone || '').replace(/\D/g, '').length >= 7, { message: 'Phone needed' });

export async function POST(req: NextRequest) {
  if (rateLimited(req, 20)) return fail('Too many tries. Please wait a few minutes.', 429);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail('Please check your answers and try again.');
  const d = parsed.data;
  if (new Date(d.travelDate + 'T00:00:00').getTime() <= Date.now()) return fail('Travel date must be in the future.');

  const dest = d.dest === 'Other' ? d.destOther || 'Other' : d.dest;
  const [first, ...rest] = d.yourName.split(/\s+/);
  const now = new Date().toISOString();
  const channels = [d.cEmail && 'email', d.cText && 'text', d.cCall && 'call'].filter(Boolean) as string[];
  const tags = ['full-intake', d.species.toLowerCase(), 'dest-' + dest.toLowerCase().replace(/\s+/g, '-')];
  if (d.who === 'My employer') tags.push('employer-move');

  try {
    await submitLead({
      firstName: first,
      lastName: rest.join(' ') || undefined,
      email: d.email,
      phone: d.cText || d.cCall || d.phone ? d.phone : undefined,
      tags,
      fields: {
        pet_name: d.petName, pet_type: d.species, breed: d.breed, age: d.age,
        weight: `${d.weight} ${d.wunit}`,
        microchip: d.chipUnknown ? 'unknown' : d.chip,
        rabies_date: d.rabiesNone ? 'none' : d.rabiesDate,
        where_from: d.from, where_to: dest, travel_date: d.travelDate,
        flexible_dates: d.flexible ? 'yes' : 'no',
        plan_type: d.plan, addons: d.addons?.join(', '), worries: d.worries?.join(', '),
        reminder_channels: channels.join(', '), company_name: d.company,
        heard_from: d.heard, source: 'website-intake',
        consent_email_at: d.cEmail ? now : undefined,
        consent_text_at: d.cText ? now : undefined,
        consent_call_at: d.cCall ? now : undefined,
      },
      consentNote: [
        `Consent (full intake), ${now}, text version ${CONSENT_VERSION}:`,
        d.cEmail && `EMAIL: "${CONSENT_TEXT.cEmail}"`,
        d.cText && `TEXT: "${CONSENT_TEXT.cText}"`,
        d.cCall && `CALL: "${CONSENT_TEXT.cCall}"`,
        `TERMS: "${CONSENT_TEXT.terms}"`,
      ].filter(Boolean).join('\n'),
      source: 'Pawsport website: full intake',
      opportunity: { name: `${d.petName} (${d.species}) to ${dest}` },
    });
  } catch (e) {
    console.error('[intake]', e);
    return fail('We could not save that just now. Please try again in a moment.', 502);
  }
  return NextResponse.json({ ok: true });
}

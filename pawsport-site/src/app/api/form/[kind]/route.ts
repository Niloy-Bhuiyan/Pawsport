import { NextRequest, NextResponse } from 'next/server';
import { mkdir, appendFile } from 'node:fs/promises';
import { fail, rateLimited } from '@/lib/guard';

// Holding route for the secondary forms until GoHighLevel is connected.
// Saves each submission to .data/submissions.jsonl so nothing is lost.
const NEEDS_EMAIL: Record<string, boolean> = { upload: false, contact: true, builder: true, arrival: true, demo: true, partner: true };

export async function POST(req: NextRequest, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  if (!(kind in NEEDS_EMAIL)) return fail('Unknown form.', 404);
  if (rateLimited(req, 20)) return fail('Too many tries. Please wait a few minutes.', 429);
  const raw = await req.text();
  if (raw.length > 20000) return fail('That is too much text.', 413);
  let body: Record<string, unknown>;
  try { body = JSON.parse(raw); } catch { return fail('Please check your answers and try again.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('Please check your answers and try again.');
  if (body.website) return fail('Please check your answers and try again.');
  if (NEEDS_EMAIL[kind] && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(body.email || ''))) return fail('Please enter a valid email.');
  try {
    await mkdir('.data', { recursive: true });
    await appendFile('.data/submissions.jsonl', JSON.stringify({ kind, at: new Date().toISOString(), body }) + '\n');
  } catch (e) {
    console.log('[form]', kind, JSON.stringify(body)); // read-only disks (e.g. Vercel): log instead
  }
  return NextResponse.json({ ok: true });
}

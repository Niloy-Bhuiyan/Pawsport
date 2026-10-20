import { NextRequest, NextResponse } from 'next/server';

// Small in-memory rate limit. Good enough for one server instance; on Vercel
// each instance has its own counter, so swap for Upstash/Redis before heavy traffic.
const hits = new Map<string, number[]>();
export function rateLimited(req: NextRequest, max = 8, windowMs = 10 * 60 * 1000) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
}

export const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

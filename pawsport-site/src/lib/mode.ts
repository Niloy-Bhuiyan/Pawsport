import { headers } from 'next/headers';

/** Picks the first layout to render on the server (phone or desktop). The browser corrects it by width. */
export async function getMode(): Promise<'d' | 'm'> {
  const ua = (await headers()).get('user-agent') || '';
  return /Mobi|Android|iPhone|iPod/i.test(ua) ? 'm' : 'd';
}

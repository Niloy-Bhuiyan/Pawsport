// Page keys used by the design files -> real URLs.
export const ROUTES: Record<string, string> = {
  Home: '/',
  Destinations: '/destinations',
  Builder: '/plan-builder',
  How: '/how-it-works',
  Pricing: '/pricing',
  Teams: '/for-teams',
  Partners: '/partners',
  Resources: '/resources',
  Portal: '/portal',
  Contact: '/contact',
  Intake: '/start',
  Quick: '/start/quick',
  Upload: '/start/documents',
  Arrival: '/arrival',
  TeamDemo: '/for-teams/demo',
  PartnerApp: '/partners/apply',
  Privacy: '/privacy',
  Terms: '/terms',
};

/** "Home-D.dc.html#x", "Intake" or "/x" -> a real href */
export function toHref(h?: string): string | undefined {
  if (!h) return h;
  const m = /^([A-Za-z]+)(?:-[DM]\.dc\.html)?(#.*)?$/.exec(h);
  if (m && ROUTES[m[1]]) return ROUTES[m[1]] + (m[2] || '');
  return h;
}

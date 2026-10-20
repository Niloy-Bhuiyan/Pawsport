// Writes the route files + registry. Run after convert.mjs.
import fs from 'node:fs';
const R = [
  ['Home', '', 'Pawsport | Every paw print leads home', 'Pawsport turns your travel date into a dated calendar for your pet\'s move abroad, with reminders by text, email or voice, and a real person when you want one.'],
  ['Destinations', 'destinations', 'Destination guides', 'Country guides for moving a pet abroad, with every step counted back from your flight date.'],
  ['Builder', 'plan-builder', 'Plan builder', 'Pick a destination and a travel date and watch your pet\'s dated calendar build itself.'],
  ['How', 'how-it-works', 'How it works', 'Tell us where and when. We count back from the flight date, remind you of every step and put a real person on the line when you want one.'],
  ['Pricing', 'pricing', 'Pricing', 'Simple plans for moving a pet abroad: a calendar, a guided plan or full coordination.'],
  ['Teams', 'for-teams', 'For teams', 'Pet relocation support for HR and mobility teams. One place to manage every employee\'s pet move.'],
  ['Partners', 'partners', 'Partners', 'Vets, shippers and pet travel professionals: join the Pawsport partner network.'],
  ['Resources', 'resources', 'Blog and resources', 'Guides, checklists and plain-English help for every stage of moving a pet abroad.'],
  ['Portal', 'portal', 'Client portal', 'Your plan, documents and messages in one place.', true],
  ['Contact', 'contact', 'Contact and booking', 'Talk to a person, chat, call or send a note. Find the right form for your question.'],
  ['Intake', 'start', 'Start a passport', 'A step by step passport for your pet\'s trip. Answer a few pages and get a dated calendar.'],
  ['Quick', 'start/quick', 'Quick stamp', 'Leave your email and travel date and get a first calendar by email.'],
  ['Upload', 'start/documents', 'Upload a document', 'Send a vet or travel document to your Pawsport plan.', true],
  ['Arrival', 'arrival', 'Arrival card', 'Tell us how the trip went with a short arrival card.', true],
  ['TeamDemo', 'for-teams/demo', 'Book a team demo', 'Book a Pawsport demo for your HR or mobility team.'],
  ['PartnerApp', 'partners/apply', 'Partner application', 'Apply to join the Pawsport partner network.'],
  ['Privacy', 'privacy', 'Privacy policy', 'What Pawsport collects, why, who sees it and how you stay in control.'],
  ['Terms', 'terms', 'Terms of service', 'What Pawsport does, what it does not do, and what we each agree to.'],
];
for (const [key, route, title, desc, noindex] of R) {
  const dir = 'src/app/' + route;
  fs.mkdirSync(dir, { recursive: true });
  const meta = `{ ${key === 'Home' ? 'title: { absolute: ' + JSON.stringify(title) + ' }' : 'title: ' + JSON.stringify(title)}, description: ${JSON.stringify(desc)}, alternates: { canonical: ${JSON.stringify('/' + route)} }${noindex ? ', robots: { index: false, follow: true }' : ''} }`;
  fs.writeFileSync(dir + '/page.tsx', `import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = ${meta};

export default async function Page() {
  return <PageSwitch k="${key}" initial={await getMode()} />;
}
`);
}
fs.writeFileSync('src/gen/registry.ts', `// @ts-nocheck
import dynamic from 'next/dynamic';
export const REG = {
${R.map(([k]) => `  ${k}: { d: dynamic(() => import('./${k}D')), m: dynamic(() => import('./${k}M')) },`).join('\n')}
};
`);
fs.writeFileSync('src/app/sitemap.ts', `import type { MetadataRoute } from 'next';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://pawsport.example';
export default function sitemap(): MetadataRoute.Sitemap {
  return ${JSON.stringify(R.filter((r) => !r[4]).map((r) => '/' + r[1]))}.map((p) => ({ url: SITE + p, changeFrequency: 'monthly', priority: p === '/' ? 1 : 0.7 }));
}
`);
fs.writeFileSync('src/app/robots.ts', `import type { MetadataRoute } from 'next';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://pawsport.example';
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/portal'] }], sitemap: SITE + '/sitemap.xml' };
}
`);
console.log('routes written');

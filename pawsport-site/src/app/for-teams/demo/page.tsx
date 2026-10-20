import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Book a team demo", description: "Book a Pawsport demo for your HR or mobility team.", alternates: { canonical: "/for-teams/demo" } };

export default async function Page() {
  return <PageSwitch k="TeamDemo" initial={await getMode()} />;
}

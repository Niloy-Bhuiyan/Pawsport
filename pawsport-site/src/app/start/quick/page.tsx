import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Quick stamp", description: "Leave your email and travel date and get a first calendar by email.", alternates: { canonical: "/start/quick" } };

export default async function Page() {
  return <PageSwitch k="Quick" initial={await getMode()} />;
}

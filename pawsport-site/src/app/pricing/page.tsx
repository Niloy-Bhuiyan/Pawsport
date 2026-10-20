import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Pricing", description: "Simple plans for moving a pet abroad: a calendar, a guided plan or full coordination.", alternates: { canonical: "/pricing" } };

export default async function Page() {
  return <PageSwitch k="Pricing" initial={await getMode()} />;
}

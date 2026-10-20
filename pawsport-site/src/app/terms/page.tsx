import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Terms of service", description: "What Pawsport does, what it does not do, and what we each agree to.", alternates: { canonical: "/terms" } };

export default async function Page() {
  return <PageSwitch k="Terms" initial={await getMode()} />;
}

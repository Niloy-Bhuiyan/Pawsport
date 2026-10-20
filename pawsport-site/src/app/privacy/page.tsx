import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Privacy policy", description: "What Pawsport collects, why, who sees it and how you stay in control.", alternates: { canonical: "/privacy" } };

export default async function Page() {
  return <PageSwitch k="Privacy" initial={await getMode()} />;
}

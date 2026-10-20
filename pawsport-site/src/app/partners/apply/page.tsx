import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Partner application", description: "Apply to join the Pawsport partner network.", alternates: { canonical: "/partners/apply" } };

export default async function Page() {
  return <PageSwitch k="PartnerApp" initial={await getMode()} />;
}

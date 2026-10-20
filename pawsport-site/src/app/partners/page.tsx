import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Partners", description: "Vets, shippers and pet travel professionals: join the Pawsport partner network.", alternates: { canonical: "/partners" } };

export default async function Page() {
  return <PageSwitch k="Partners" initial={await getMode()} />;
}

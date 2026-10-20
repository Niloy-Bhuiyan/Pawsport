import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Destination guides", description: "Country guides for moving a pet abroad, with every step counted back from your flight date.", alternates: { canonical: "/destinations" } };

export default async function Page() {
  return <PageSwitch k="Destinations" initial={await getMode()} />;
}

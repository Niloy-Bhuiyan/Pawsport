import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Arrival card", description: "Tell us how the trip went with a short arrival card.", alternates: { canonical: "/arrival" }, robots: { index: false, follow: true } };

export default async function Page() {
  return <PageSwitch k="Arrival" initial={await getMode()} />;
}

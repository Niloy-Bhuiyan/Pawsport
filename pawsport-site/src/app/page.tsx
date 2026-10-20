import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: { absolute: "Pawsport | Every paw print leads home" }, description: "Pawsport turns your travel date into a dated calendar for your pet's move abroad, with reminders by text, email or voice, and a real person when you want one.", alternates: { canonical: "/" } };

export default async function Page() {
  return <PageSwitch k="Home" initial={await getMode()} />;
}

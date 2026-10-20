import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "How it works", description: "Tell us where and when. We count back from the flight date, remind you of every step and put a real person on the line when you want one.", alternates: { canonical: "/how-it-works" } };

export default async function Page() {
  return <PageSwitch k="How" initial={await getMode()} />;
}

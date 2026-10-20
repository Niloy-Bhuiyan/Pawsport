import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Start a passport", description: "A step by step passport for your pet's trip. Answer a few pages and get a dated calendar.", alternates: { canonical: "/start" } };

export default async function Page() {
  return <PageSwitch k="Intake" initial={await getMode()} />;
}

// cta

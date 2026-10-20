import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Plan builder", description: "Pick a destination and a travel date and watch your pet's dated calendar build itself.", alternates: { canonical: "/plan-builder" } };

export default async function Page() {
  return <PageSwitch k="Builder" initial={await getMode()} />;
}

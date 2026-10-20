import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "For teams", description: "Pet relocation support for HR and mobility teams. One place to manage every employee's pet move.", alternates: { canonical: "/for-teams" } };

export default async function Page() {
  return <PageSwitch k="Teams" initial={await getMode()} />;
}

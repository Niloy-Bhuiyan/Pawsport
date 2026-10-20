import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Client portal", description: "Your plan, documents and messages in one place.", alternates: { canonical: "/portal" }, robots: { index: false, follow: true } };

export default async function Page() {
  return <PageSwitch k="Portal" initial={await getMode()} />;
}

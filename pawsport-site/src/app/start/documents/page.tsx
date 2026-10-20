import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Upload a document", description: "Send a vet or travel document to your Pawsport plan.", alternates: { canonical: "/start/documents" }, robots: { index: false, follow: true } };

export default async function Page() {
  return <PageSwitch k="Upload" initial={await getMode()} />;
}

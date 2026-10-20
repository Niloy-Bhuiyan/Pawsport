import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Blog and resources", description: "Guides, checklists and plain-English help for every stage of moving a pet abroad.", alternates: { canonical: "/resources" } };

export default async function Page() {
  return <PageSwitch k="Resources" initial={await getMode()} />;
}

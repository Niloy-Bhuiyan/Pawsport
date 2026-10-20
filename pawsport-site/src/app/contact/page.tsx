import type { Metadata } from 'next';
import PageSwitch from '@/components/PageSwitch';
import { getMode } from '@/lib/mode';

export const metadata: Metadata = { title: "Contact and booking", description: "Talk to a person, chat, call or send a note. Find the right form for your question.", alternates: { canonical: "/contact" } };

export default async function Page() {
  return <PageSwitch k="Contact" initial={await getMode()} />;
}

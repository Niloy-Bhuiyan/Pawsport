import type { Metadata, Viewport } from 'next';
import './globals.css';
import './site.css';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://pawsport.example';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Pawsport | Every paw print leads home', template: '%s | Pawsport' },
  description:
    'Pawsport turns your travel date into a dated calendar for your pet\'s move abroad, with reminders by text, email or voice, and a real person when you want one.',
  applicationName: 'Pawsport',
  openGraph: { type: 'website', siteName: 'Pawsport', title: 'Pawsport | Every paw print leads home', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F6ECD7' };

// Sets the screen scale before first paint so there is no jump.
const SCALE = `(function(){try{var w=document.documentElement.clientWidth,m=w<820;document.documentElement.style.setProperty('--z',String(m?Math.min(w/390,1.35):Math.min(w/1440,2)));document.documentElement.dataset.vm=m?'m':'d'}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCALE }} />
        <link rel="preload" href="/fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/figtree-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

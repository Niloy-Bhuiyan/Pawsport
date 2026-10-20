'use client';
import { useEffect, useState } from 'react';
import { REG } from '@/gen/registry';

const BREAK = 820; // below this width the phone layout is used

// One-screen booklet pages: scale to fit the window height too, so the whole book is visible without scrolling.
const FIT = new Set(['Intake', 'Quick', 'Upload', 'Arrival', 'TeamDemo', 'PartnerApp']);

// Pages restyled toward a calmer, minimal look (see globals.css ".minimal" rules). Home keeps its full treatment.
const MINIMAL = new Set(['Destinations', 'How', 'Pricing', 'Builder', 'Teams', 'Partners', 'Resources', 'Portal', 'Contact', 'Privacy', 'Terms']);

export function applyScale(k?: string) {
  const w = document.documentElement.clientWidth;
  const m = w < BREAK;
  let z = m ? Math.min(w / 390, 1.35) : Math.min(w / 1440, 2);
  if (k && FIT.has(k)) z = Math.max(0.5, Math.min(z, window.innerHeight / (m ? 844 : 900)));
  document.documentElement.style.setProperty('--z', String(z));
  document.documentElement.dataset.vm = m ? 'm' : 'd';
  return m ? 'm' : 'd';
}

export default function PageSwitch({ k, initial }: { k: string; initial: 'd' | 'm' }) {
  const [mode, setMode] = useState<'d' | 'm'>(initial);
  useEffect(() => {
    const on = () => setMode(applyScale(k) as 'd' | 'm');
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [k]);
  const C = REG[k][mode];
  return (
    <div data-k={k} className={`stage ${mode}${FIT.has(k) ? ' fit' : ''}${MINIMAL.has(k) ? ' minimal' : ''}`}>
      <C />
    </div>
  );
}

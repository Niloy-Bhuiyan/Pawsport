'use client';
import { Lk } from '@/lib/dc';

const LINKS: Array<[string, string]> = [
  ['Destinations', 'Destinations'],
  ['Plan builder', 'Builder'],
  ['How it works', 'How'],
  ['Pricing', 'Pricing'],
  ['For teams', 'Teams'],
  ['Resources', 'Resources'],
];

export default function SiteNav({ v, dm }: { v: any; dm: 'D' | 'M' }) {
  const page = (key: string) => `${key}-${dm}.dc.html`;
  return (
    <>
      <div className="snav">
        <Lk className="sbrand" href={page('Home')}>
          <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true"><path d="M5 26 V9 L10 3 L13 9 H17 L20 3 L25 9 V26 Z" fill="#2B2118"></path></svg>
          {'Pawsport'}
        </Lk>
        <ul className="slinks">
          {LINKS.map(([label, key]) => (
            <li key={key}><Lk href={page(key)}>{label}</Lk></li>
          ))}
        </ul>
        <div className="sactions">
          <Lk className="btn btn-outline btn-sm" href={page('Portal')}>{'Log in'}</Lk>
          <Lk className="btn btn-primary btn-sm" href={page('Contact')}>{'Talk to a person'}</Lk>
          <button className="sburger" aria-label="Menu" onClick={v.toggleMenu}><i></i></button>
        </div>
      </div>
      {v.menuOpen ? (
        <div className="sdrawer">
          <button className="sdx" aria-label="Close" onClick={v.toggleMenu}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15"></path></svg>
          </button>
          <nav className="sdlinks">
            <Lk href={page('Home')}>{'Home'}</Lk>
            {LINKS.map(([label, key]) => (<Lk key={key} href={page(key)}>{label}</Lk>))}
            <Lk href={page('Portal')}>{'Client portal'}</Lk>
            <Lk href={page('Contact')}>{'Contact'}</Lk>
          </nav>
          <Lk className="btn btn-primary" href={page('Contact')}>{'Talk to a person'}</Lk>
        </div>
      ) : null}
    </>
  );
}

// nav reviewed

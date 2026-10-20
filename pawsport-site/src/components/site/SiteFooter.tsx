import { Lk } from '@/lib/dc';

const COLS: Array<[string, Array<[string, string]>]> = [
  ['Plan', [['Destination guides', 'Destinations'], ['Plan builder', 'Builder'], ['Pricing', 'Pricing'], ['Client portal', 'Portal']]],
  ['Learn', [['How it works', 'How'], ['Blog and resources', 'Resources'], ['Contact and booking', 'Contact']]],
  ['Start a passport', [['Quick stamp', 'Quick'], ['Full passport', 'Intake'], ['Upload a document', 'Upload'], ['Arrival card', 'Arrival']]],
  ['Work with us', [['Pawsport for Teams', 'Teams'], ['Partner program', 'Partners'], ['Company demo', 'TeamDemo'], ['Apply to partner', 'PartnerApp']]],
];

export default function SiteFooter({ dm }: { dm: 'D' | 'M' }) {
  const page = (key: string) => `${key}-${dm}.dc.html`;
  return (
    <footer className="sfoot">
      <div className="sfoot-top">
        <div className="sfoot-brand">
          <Lk className="sbrand" href={page('Home')}>
            <svg width="24" height="24" viewBox="0 0 30 30" aria-hidden="true"><path d="M5 26 V9 L10 3 L13 9 H17 L20 3 L25 9 V26 Z" fill="#2B2118"></path></svg>
            {'Pawsport'}
          </Lk>
          <p>{"Every paw print leads home. We coordinate your pet's move, one dated step at a time."}</p>
        </div>
        <div className="sfoot-cols">
          {COLS.map(([head, links]) => (
            <div className="sfoot-col" key={head}>
              <h4>{head}</h4>
              {links.map(([label, key]) => (<Lk key={key} href={page(key)}>{label}</Lk>))}
            </div>
          ))}
        </div>
      </div>
      <div className="sfoot-legal">
        <p>{'Good to know. Pawsport coordinates your pet\'s move. We do not give veterinary or legal advice, and we never promise border approval. Rules change, so every step links to an official source and a person checks updates before we tell you.'}</p>
        <div className="sfoot-bottom">
          <span>{'© 2027 Pawsport'}</span>
          <ul className="slinks">
            <li><Lk href={page('Privacy')}>{'Privacy policy'}</Lk></li>
            <li><Lk href={page('Terms')}>{'Terms'}</Lk></li>
            <li><Lk href={`${page('Privacy')}#preferences`}>{'Text and email preferences'}</Lk></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

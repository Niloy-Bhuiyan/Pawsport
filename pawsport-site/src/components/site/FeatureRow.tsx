import type { ReactNode } from 'react';

export default function FeatureRow({ num, title, children, visual, reverse }: { num: string; title: string; children: ReactNode; visual: ReactNode; reverse?: boolean }) {
  return (
    <div className={`sfeat${reverse ? ' rev' : ''}`}>
      <div className="sfeat-text">
        <span className="sfnum">{num}</span>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
      <div className="sfeat-visual">{visual}</div>
    </div>
  );
}

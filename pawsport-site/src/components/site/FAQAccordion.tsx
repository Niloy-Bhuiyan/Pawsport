'use client';
import { useState } from 'react';

export default function FAQAccordion({ items }: { items: Array<[string, string]> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="sfaq">
      {items.map(([q, a], i) => (
        <div key={i} className={`sfaq-item${open === i ? ' open' : ''}`}>
          <button className="sfaq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span>{q}</span>
            <span className="sfplus">+</span>
          </button>
          <div className="sfaq-a"><p>{a}</p></div>
        </div>
      ))}
    </div>
  );
}

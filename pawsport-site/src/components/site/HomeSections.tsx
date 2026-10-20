/**
 * Home is deliberately short now: hero, one lean "how it works", done — the
 * real work (filling in the trip, subscribing) happens on the passport page
 * this leads into, not in a long marketing scroll here.
 */
const STEPS: Array<[string, string]> = [
  ['Tell us where', 'Pet, route and travel date. Two minutes, no jargon.'],
  ['Get a dated calendar', 'Every task counted back from takeoff, with the date next to it.'],
  ['A human when stuck', 'Fall behind or feel lost? A coordinator steps in.'],
];

export default function HomeSections({ v, dm }: { v: any; dm: 'D' | 'M' }) {
  return (
    <section className="ssec">
      <div className="ssec-head">
        <h2>{'How it works'}</h2>
      </div>
      <div className="ssteps3">
        {STEPS.map(([title, desc], i) => (
          <div className="sstep3" key={title}>
            <span className="sstep3-n">{i + 1}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
      <div className="scal-inline">
        {(v.items ?? []).slice(0, 4).map((it: any, i: number) => {
          const on = typeof it.cls === 'string' && it.cls.includes('on');
          return (
            <button key={i} className={`scal-chip${on ? ' on' : ''}`} onClick={it.toggle}>
              {on ? '✓ ' : ''}{it.title}
            </button>
          );
        })}
        <span className="scal-inline-msg">{v.msg}</span>
      </div>
    </section>
  );
}

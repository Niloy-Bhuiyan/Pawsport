// @ts-nocheck
/* eslint-disable */
// Hand-authored (rebuilt from the original generated page): the chat widget
// and the headline/suitcase hero illustration below are kept verbatim from
// the original design; everything else was rebuilt around x.ai/bot's
// nav/feature-row/FAQ/footer structure, reusing this page's own content.
'use client';
import { DCLogic, useDC } from '@/lib/dc';
import { CSS } from './_homeCss';
import SiteNav from '@/components/site/SiteNav';
import HomeHero from '@/components/site/HomeHero';
import HomeSections from '@/components/site/HomeSections';
import SiteFooter from '@/components/site/SiteFooter';
import BiscuitChat from '@/components/site/BiscuitChat';


class Logic extends DCLogic {
state = { menu:false,done:[1,1,0,0,0,0,0,0],chOpen: false, chMsgs: [{ w: 'b', t: 'Hi, I am Biscuit. I coordinate pet trips.' }, { w: 'b', t: 'What would you like to do?' }], chChips: [["ask", "Build my calendar", "cal"], ["ask", "How does it work?", "how"], ["ask", "Will my pet be approved?", "approve"], ["ask", "Talk to a person", "human"]], chTyping: false, chInput: '', chForm: false, chName: '', chContact: '', chOk: false, chSent: false, chVoice: false, chTip: true, chFly: false };

chT = null;

chPush(msgs, chips, extra) { const s = this.state; this.setState({ chMsgs: [...s.chMsgs, ...msgs], chChips: chips, chTyping: false, ...(extra || {}) }); }
chAsk(key, label) { const s = this.state; if (s.chTyping) return; const lab = label || ({ cal: 'Build my calendar', how: 'How does it work?', approve: 'Will my pet be approved?', human: 'Talk to a person', price: 'Pricing', where: 'Which countries?', advice: 'Vet or legal advice?', remind: 'Yes, remind me', next: 'When is my next step?' })[key] || key;
this.setState({ chMsgs: [...s.chMsgs, { w: 'u', t: lab }], chChips: [], chTyping: true, chTip: false });
clearTimeout(this.chT); this.chT = setTimeout(() => this.chReply(key), 1100); }
chReply(key) { const A = {"cal": ["Lovely. Pick a destination and a date, and I will draw your whole trail in about four minutes. Every page gets a stamp.", [["link", "Open my passport", "Intake"]]], "how": ["You tell us where and when. We count back from the flight date and give you a dated calendar. We remind you by text, email or call, and a real person is one tap away.", [["ask", "Pricing", "price"], ["ask", "Which countries?", "where"], ["ask", "Talk to a person", "human"]]], "price": ["Calendar is $49 once. We handle it is $349 once. Those are sample prices for this prototype.", [["ask", "How does it work?", "how"], ["ask", "Talk to a person", "human"]]], "where": ["Most routes. For each one we read the official source and a person double checks it before it goes on your calendar.", [["link", "Destination guides", "Destinations"], ["ask", "Talk to a person", "human"]]], "approve": ["We never promise border approval. We coordinate the steps and the dates. The destination country makes the decision.", [["ask", "Vet or legal advice?", "advice"], ["ask", "Talk to a person", "human"]]], "advice": ["We do not give vet or legal advice. Your vet and the airline answer those. We make sure you never miss a step.", [["ask", "How does it work?", "how"], ["ask", "Talk to a person", "human"]]], "human": ["Happy to. Leave your name and how to reach you, and a coordinator will pick it up.", []], "next": ["Your next step is the rabies vaccination on 17 Dec. Want me to remind you a week before?", [["ask", "Yes, remind me", "remind"], ["ask", "Talk to a person", "human"]]], "remind": ["Done. I will text you 7 days before. Reply STOP any time to opt out.", []], "fallback": ["I am not sure about that one. A person can answer it properly.", [["ask", "Talk to a person", "human"], ["ask", "How does it work?", "how"]]]}; const a = A[key] || A.fallback; const chips = a[1].map(c => c); this.chPush([{ w: 'b', t: a[0] }], chips, key === 'human' ? { chForm: true } : {}); }
chSubmit() { const s = this.state; const t = s.chInput.trim(); if (!t || s.chTyping) return; const l = t.toLowerCase(); let k = 'fallback';
if (/(price|cost|how much|pay)/.test(l)) k = 'price'; else if (/(approve|border|guarantee|allowed)/.test(l)) k = 'approve'; else if (/(vet|legal|medical|advice)/.test(l)) k = 'advice'; else if (/(human|person|call|agent|someone)/.test(l)) k = 'human'; else if (/(how|work|start)/.test(l)) k = 'how'; else if (/(country|where|canada|uk|europe|australia|japan|usa)/.test(l)) k = 'where'; else if (/(next|step|due|when)/.test(l)) k = 'next'; else if (/(calendar|plan|build)/.test(l)) k = 'cal';
this.setState({ chMsgs: [...s.chMsgs, { w: 'u', t }], chInput: '', chChips: [], chTyping: true, chTip: false }); clearTimeout(this.chT); this.chT = setTimeout(() => this.chReply(k), 1100); }
chSendForm() { const s = this.state; if (!(s.chName.trim() && s.chContact.trim() && s.chOk)) return; this.setState({ chFly: true, chForm: false, chSent: true, chMsgs: [...s.chMsgs, { w: 'u', t: s.chName.trim() + ', ' + s.chContact.trim() }], chTyping: true });
clearTimeout(this.chT); this.chT = setTimeout(() => this.chPush([{ w: 'b', t: 'Sent. A coordinator will reach out. Thank you, ' + s.chName.trim().split(' ')[0] + '.' }], [['ask', 'How does it work?', 'how']], { chFly: false }), 1400); }
chMic() { const s = this.state; if (s.chVoice) { this.setState({ chVoice: false }); return; } this.setState({ chVoice: true }); clearTimeout(this.chT); this.chT = setTimeout(() => { const st = this.state; if (!st.chVoice) return; this.setState({ chVoice: false, chMsgs: [...st.chMsgs, { w: 'u', t: 'When is my next step?' }], chChips: [], chTyping: true }); this.chT = setTimeout(() => this.chReply('next'), 1000); }, 3200); }
renderVals() {
const s = this.state;
const DEFS = [["T-120", "Microchip check", "17 Oct"], ["T-90", "Rabies vaccination", "16 Nov"], ["T-45", "Blood test, if your route needs it", "31 Dec"], ["T-30", "Book flight and crate", "15 Jan"], ["T-14", "Pick the vet for your certificate", "31 Jan"], ["T-10", "Vet health certificate", "4 Feb"], ["T-5", "Government endorsement", "9 Feb"], ["T-0", "Flight day", "14 Feb"]];
const items = DEFS.map((d, i) => ({ off: d[0], title: d[1], date: d[2], cls: 'row' + (s.done[i] ? ' on' : ''), toggle: () => { const n = s.done.slice(); n[i] = n[i] ? 0 : 1; this.setState({ done: n }); } }));
const n = s.done.filter(Boolean).length;
const msg = n < 3 ? 'Tick a step. Biscuit is watching.' : n === 3 ? '3 of 8 done. Biscuit is proud.' : n < 8 ? n + ' of 8 done. Keep going.' : 'All 8 done. Wheels up!';
const P = {};
for (let i = 0; i < 8; i++) P['p' + i] = i < n ? 'on' : '';
const chL = s.chMsgs.map((m, i) => ({ cls: 'chm ' + (m.w === 'u' ? 'me' : 'bot') + (i === s.chMsgs.length - 1 ? ' last' : ''), t: m.t })).reverse();
const chChipL = s.chChips.map(c => ({ lbl: c[1], isLink: c[0] === 'link', isAsk: c[0] === 'ask', href: c[0] === 'link' ? (c[2] + '-D.dc.html') : '', go: () => this.chAsk(c[2], c[1]) }));
const chOkSend = s.chName.trim() && s.chContact.trim() && s.chOk;
return { menuOpen: s.menu, toggleMenu: () => this.setState({ menu: !s.menu }),items, msg, allDone: n === 8, ...P,
chOpen: s.chOpen, chCls: 'chw' + (s.chOpen ? ' open' : '') + (s.chVoice ? ' vox' : ''), chToggle: () => this.setState({ chOpen: !s.chOpen, chTip: false }), chOpenIt: () => this.setState({ chOpen: true, chTip: false }),
chList: chL, chChipL: chChipL, chTyping: s.chTyping, chInput: s.chInput, onChInput: (e) => this.setState({ chInput: e.target.value }), chSend: () => this.chSubmit(),
chForm: s.chForm, chName: s.chName, chContact: s.chContact, onChName: (e) => this.setState({ chName: e.target.value }), onChContact: (e) => this.setState({ chContact: e.target.value }),
chOkCls: 'chok' + (s.chOk ? ' on' : ''), chOkTg: () => this.setState({ chOk: !s.chOk }), chFormSend: () => this.chSendForm(), chFormOff: !chOkSend,
chTipCls: 'chtip' + (s.chTip && !s.chOpen ? ' show' : ''), chFlyCls: 'chfly' + (s.chFly ? ' go' : ''), chMicTg: () => this.chMic(), chVoiceCls: 'chvox' + (s.chVoice ? ' on' : ''), chVoiceOff: () => this.setState({ chVoice: false }) };
}
}


export default function HomeD(props) {
  const v = useDC(Logic, props);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pg d">
        <SiteNav v={v} dm="D" />
        <HomeHero dm="D" />
        <HomeSections v={v} dm="D" />
        <SiteFooter dm="D" />
        <BiscuitChat v={v} dm="D" />
      </div>
    </>
  );
}

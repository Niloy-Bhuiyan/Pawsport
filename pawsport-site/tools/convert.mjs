// Converts the design templates (*.dc.html) into React (TSX) components.
// usage: node tools/convert.mjs gen-in src/gen
import fs from 'node:fs';
import path from 'node:path';
import { parseFragment } from 'parse5';

const [, , IN, OUT] = process.argv;
fs.mkdirSync(OUT, { recursive: true });

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const BOOL = new Set(['disabled', 'checked', 'readonly', 'required', 'multiple', 'selected', 'autofocus', 'hidden', 'open', 'autoplay', 'controls', 'loop', 'muted']);
const RENAME = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  autocomplete: 'autoComplete', autofocus: 'autoFocus', colspan: 'colSpan', rowspan: 'rowSpan', inputmode: 'inputMode',
  spellcheck: 'spellCheck', contenteditable: 'contentEditable', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace',
  enterkeyhint: 'enterKeyHint', accept: 'accept', srcset: 'srcSet', crossorigin: 'crossOrigin', autocapitalize: 'autoCapitalize',
};
const EVENTS = Object.fromEntries(['onClick', 'onChange', 'onInput', 'onKeyDown', 'onKeyUp', 'onKeyPress', 'onSubmit', 'onFocus', 'onBlur', 'onMouseEnter', 'onMouseLeave', 'onMouseDown', 'onMouseUp', 'onTouchStart', 'onTouchEnd', 'onDoubleClick', 'onScroll', 'onDrop', 'onDragOver', 'onDragEnter', 'onDragLeave'].map((n) => [n.toLowerCase(), n]));
const DROP = new Set(['hint-placeholder-val', 'hint-placeholder-count', 'data-dc-tpl']);

const HOLE = /\{\{\s*([\w.]+)\s*\}\}/g;
const hasHole = (s) => /\{\{/.test(s);
const pureHole = (s) => { const m = /^\s*\{\{\s*([\w.]+)\s*\}\}\s*$/.exec(s); return m ? m[1] : null; };

function ref(p, scope) {
  const parts = p.split('.');
  const root = scope.has(parts[0]) ? parts[0] : 'v.' + parts[0];
  return root + parts.slice(1).map((x) => '?.' + x).join('');
}
// "a {{b}} c" -> template literal
function tpl(s, scope) {
  let out = '`';
  let last = 0;
  for (const m of s.matchAll(HOLE)) {
    out += esc(s.slice(last, m.index)) + '${' + ref(m[1], scope) + ' ?? ""}';
    last = m.index + m[0].length;
  }
  return out + esc(s.slice(last)) + '`';
}
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

function splitDecl(s) {
  const out = []; let cur = ''; let depth = 0; let q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}
function camel(p) {
  if (p.startsWith('--')) return p;
  p = p.replace(/^-ms-/, 'ms-');
  return p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
function styleObj(s, scope) {
  const items = [];
  for (const d of splitDecl(s)) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    const prop = d.slice(0, i).trim();
    let val = d.slice(i + 1).trim();
    if (!prop) continue;
    const key = JSON.stringify(camel(prop));
    if (hasHole(val)) items.push(`${key}: ${tpl(val, scope)}`);
    else items.push(`${key}: ${JSON.stringify(val)}`);
  }
  return '{{' + items.join(', ') + '}}';
}

function attrs(node, scope, inSvg) {
  const tag = node.tagName;
  const parts = [];
  for (const a of node.attrs) {
    let name = a.name; const val = a.value;
    if (DROP.has(name)) continue;
    const lname = name.toLowerCase();
    if (EVENTS[lname]) { // event handler (the HTML parser lower-cases names)
      const p = pureHole(val);
      if (p) parts.push(`${EVENTS[lname]}={${ref(p, scope)}}`);
      continue;
    }
    if (lname === 'style') { parts.push(`style=${hasHole(val) || true ? styleObj(val, scope) : ''}`); continue; }
    let jn = RENAME[lname] || name;
    if (!RENAME[lname] && /-/.test(name) && !/^(data|aria)-/.test(name)) jn = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    // boolean attributes
    if (BOOL.has(lname)) {
      const p = pureHole(val);
      if (p) { parts.push(`${jn}={!!${ref(p, scope)}}`); continue; }
      if (lname === 'selected') continue;
      if (lname === 'checked') { parts.push('defaultChecked'); continue; }
      parts.push(jn); continue;
    }
    if (lname === 'value') {
      const p = pureHole(val);
      if (p) { parts.push(`value={${ref(p, scope)} ?? ''}`); continue; }
      if (hasHole(val)) { parts.push(`value={${tpl(val, scope)}}`); continue; }
      if (tag === 'input' || tag === 'textarea' || tag === 'select') { parts.push(`defaultValue=${JSON.stringify(val)}`); continue; }
    }
    const p = pureHole(val);
    if (p) { parts.push(`${jn}={${ref(p, scope)}}`); continue; }
    if (hasHole(val)) { parts.push(`${jn}={${tpl(val, scope)}}`); continue; }
    parts.push(`${jn}=${JSON.stringify(val)}`);
  }
  return parts.length ? ' ' + parts.join(' ') : '';
}

let loopId = 0;
function children(node, scope, inSvg, clk) {
  const kids = node.childNodes || [];
  const out = [];
  kids.forEach((c, idx) => {
    const e = emit(c, scope, inSvg, idx === 0, idx === kids.length - 1, node, clk);
    if (e) out.push(e);
  });
  return out.join('');
}

function textExpr(t, scope) {
  // text with holes -> sequence of {"..."}{v.x}
  let out = ''; let last = 0;
  for (const m of t.matchAll(HOLE)) {
    if (m.index > last) out += `{${JSON.stringify(t.slice(last, m.index))}}`;
    out += `{${ref(m[1], scope)}}`;
    last = m.index + m[0].length;
  }
  if (last < t.length) out += `{${JSON.stringify(t.slice(last))}}`;
  return out;
}

function emit(node, scope, inSvg, first, last, parent, clk) {
  if (node.nodeName === '#comment') return '';
  if (node.nodeName === '#text') {
    const t = node.value;
    if (!t) return '';
    if (/^\s*$/.test(t)) {
      if (inSvg && parent.tagName !== 'text') return '';
      if (['select', 'optgroup', 'table', 'tbody', 'tr', 'ul', 'ol'].includes(parent.tagName)) return '';
      if (first || last) return '';
      return '{" "}';
    }
    return textExpr(t, scope);
  }
  const tag = node.tagName;
  if (tag === 'sc-if') {
    const vAttr = node.attrs.find((a) => a.name === 'value');
    const p = vAttr && pureHole(vAttr.value);
    const inner = children(node, scope, inSvg, clk);
    return `{(${p ? ref(p, scope) : 'false'}) ? (<>${inner}</>) : null}`;
  }
  if (tag === 'sc-for') {
    const l = pureHole(node.attrs.find((a) => a.name === 'list')?.value || '');
    const as = node.attrs.find((a) => a.name === 'as')?.value || 'item';
    const sc2 = new Set(scope); sc2.add(as);
    const id = ++loopId;
    const inner = children(node, sc2, inSvg, clk);
    return `{(${l ? ref(l, scope) : '[]'} ?? []).map((${as}, $i${id}) => (<Fragment key={$i${id}}>${inner}</Fragment>))}`;
  }
  const svgNow = inSvg || tag === 'svg';
  const isSvgChild = svgNow;
  let jtag = tag;
  let at = attrs(node, scope, svgNow);
  const clickable = clk || node.attrs.some((a) => a.name === 'onclick');
  if (tag === 'a') {
    jtag = 'Lk';
    const href = (node.attrs.find((a) => a.name === 'href') || {}).value || '';
    // legal links inside a clickable consent row open in a new tab and do not toggle the row
    if (clickable && /^(Privacy|Terms)/.test(href)) at += ' target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}';
  }
  if (tag === 'textarea') {
    const txt = (node.childNodes || []).map((c) => c.value || '').join('');
    if (!/value=/.test(at) && txt) return `<textarea${at} defaultValue=${JSON.stringify(txt)} />`;
    return `<textarea${at} />`;
  }
  if (VOID.has(tag)) return `<${jtag}${at} />`;
  const inner = children(node, scope, svgNow, clickable);
  return `<${jtag}${at}>${inner}</${jtag}>`;
}

function convert(file) {
  const src = fs.readFileSync(path.join(IN, file), 'utf8');
  const base = file.replace('.dc.html', '');          // Home-D
  const [key, mode] = base.split('-');
  const title = (/<title>([\s\S]*?)<\/title>/.exec(src) || [])[1] || key;
  const x = src.slice(src.indexOf('<x-dc>') + 6, src.indexOf('</x-dc>'));
  const css = (/<style>([\s\S]*?)<\/style>/.exec(x) || [])[1] || '';
  const bodyHtml = x.slice(x.indexOf('</helmet>') + 9);
  const scriptM = /<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/.exec(src);
  const script = scriptM[1].replace('class Component extends DCLogic', 'class Logic extends DCLogic');
  const frag = parseFragment(bodyHtml);
  loopId = 0;
  const jsx = children(frag, new Set(), false);
  const comp = `${key}${mode}`;
  const code = `// @ts-nocheck
/* eslint-disable */
// Generated by tools/convert.mjs from the Pawsport design. Do not edit by hand, re-run the converter.
'use client';
import { Fragment } from 'react';
import { DCLogic, useDC, Lk } from '@/lib/dc';

${script}

const CSS = ${JSON.stringify(css)};

export default function ${comp}(props) {
  const v = useDC(Logic, props);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      ${jsx}
    </>
  );
}
`;
  fs.writeFileSync(path.join(OUT, `${comp}.tsx`), code);
  return { key, mode, comp, title: title.replace(/^Pawsport\s*/, '') };
}

const files = fs.readdirSync(IN).filter((f) => f.endsWith('.dc.html'));
const meta = {};
for (const f of files) {
  const r = convert(f);
  meta[r.key] = meta[r.key] || { title: r.title };
  console.log('converted', f);
}
fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 1));

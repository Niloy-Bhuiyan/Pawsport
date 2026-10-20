'use client';
import Link from 'next/link';
import { useEffect, useReducer, useRef } from 'react';
import type { AnchorHTMLAttributes } from 'react';
import { toHref } from './routes';

/**
 * Tiny state container used by the page logic. Same shape as the design tool:
 * `state`, `setState`, `renderVals()` and the usual lifecycle methods.
 */
export class DCLogic {
  props: any;
  state: any = {};
  __host: any;
  constructor(props?: any) { this.props = props || {}; }
  setState(partial: any, cb?: () => void) { this.__host && this.__host.set(partial, cb); }
  forceUpdate() { this.__host && this.__host.force(); }
  componentDidMount() {}
  componentDidUpdate(_prev?: any) {}
  componentWillUnmount() {}
  renderVals(): any { return {}; }
}

export function useDC(Cls: any, props: any) {
  const [, force] = useReducer((x: number) => x + 1, 0);
  const ref = useRef<any>(null);
  const cbs = useRef<Array<() => void>>([]);
  if (!ref.current) {
    const l = new Cls(props);
    l.__host = {
      set(partial: any, cb?: () => void) {
        const u = typeof partial === 'function' ? partial(l.state) : partial;
        l.state = { ...l.state, ...u };
        if (cb) cbs.current.push(cb);
        force();
      },
      force() { force(); },
    };
    ref.current = l;
  }
  const logic = ref.current;
  logic.props = props;
  const first = useRef(true);
  useEffect(() => {
    logic.componentDidMount();
    return () => logic.componentWillUnmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    logic.componentDidUpdate();
    const q = cbs.current; cbs.current = [];
    q.forEach((f) => f());
  });
  return { ...props, ...logic.renderVals() };
}

/** Anchor that maps design page keys to real routes and uses client navigation. */
export function Lk({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const h = toHref(href as string);
  if (h && h.startsWith('/')) return <Link href={h} {...(rest as any)}>{children}</Link>;
  const ext = h && /^https?:/.test(h);
  return <a href={h} {...rest} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
}

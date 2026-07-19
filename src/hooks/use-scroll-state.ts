'use client';

import { useEffect, useRef, useState } from 'react';

type Options = {
  /** Distance scrolled before the bar is considered "condensed". */
  condenseAt?: number;
  /** Minimum delta between samples before the direction flips — prevents jitter. */
  threshold?: number;
  /** When false, the bar never auto-hides (e.g. while a menu is open). */
  enabled?: boolean;
};

export type ScrollState = {
  /** True once the page has scrolled past `condenseAt`. */
  condensed: boolean;
  /** True when scrolling down and past the condense point. */
  hidden: boolean;
  /** True while the viewport sits at the top of the document. */
  atTop: boolean;
};

const INITIAL: ScrollState = { condensed: false, hidden: false, atTop: true };

export function useScrollState({
  condenseAt = 24,
  threshold = 8,
  enabled = true,
}: Options = {}): ScrollState {
  const [state, setState] = useState<ScrollState>(INITIAL);
  const previous = useRef(0);
  const enabledRef = useRef(enabled);

  enabledRef.current = enabled;

  useEffect(() => {
    const read = () => {
      const y = window.scrollY;
      const delta = y - previous.current;
      previous.current = y;

      setState((current) => {
        const atTop = y <= 2;
        const condensed = y > condenseAt;

        let hidden = current.hidden;
        if (!enabledRef.current || !condensed) {
          hidden = false;
        } else if (Math.abs(delta) > threshold) {
          hidden = delta > 0;
        }

        if (
          current.atTop === atTop &&
          current.condensed === condensed &&
          current.hidden === hidden
        ) {
          return current;
        }

        return { atTop, condensed, hidden };
      });
    };

    previous.current = window.scrollY;
    read(); // sync on mount — handles a refresh at a scrolled position

    // Read straight from the scroll event: `scrollY` is a cheap read, and rAF
    // is starved in background/hidden tabs, which would freeze the bar.
    window.addEventListener('scroll', read, { passive: true });

    return () => window.removeEventListener('scroll', read);
  }, [condenseAt, threshold]);

  // Re-show the bar as soon as auto-hide is disabled (menu opened).
  useEffect(() => {
    if (!enabled) setState((current) => (current.hidden ? { ...current, hidden: false } : current));
  }, [enabled]);

  return state;
}

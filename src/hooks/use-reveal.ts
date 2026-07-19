'use client';

import { useEffect, useRef, useState } from 'react';

type Options = {
  /** IntersectionObserver rootMargin — when the reveal should trigger. */
  margin?: string;
  /** Reveal on mount (hero) rather than on scroll into view. */
  immediate?: boolean;
};

type RevealState = {
  /** Apply the hidden start-state. Only ever true when animation can run. */
  armed: boolean;
  /** Reveal is complete / in progress. */
  inView: boolean;
};

/**
 * Drives a CSS scroll-reveal with a hard guarantee that content is never left
 * invisible.
 *
 * The element is visible by default. We only "arm" the hidden start-state when
 * we can confirm the animation will actually run — a foreground tab with
 * IntersectionObserver support. Where it can't run (no JS, no IO, or a
 * backgrounded tab where CSS transitions are frozen), the element is never
 * armed and simply stays visible.
 *
 * `immediate` mode starts armed on the server so hero content rises in without
 * a flash, but is un-armed on mount if animation can't run.
 */
export function useReveal<T extends HTMLElement = HTMLElement>({
  margin = '-10% 0px',
  immediate = false,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  // Hero content starts armed (hidden) on the server to avoid a visible flash.
  const [state, setState] = useState<RevealState>({ armed: immediate, inView: false });

  useEffect(() => {
    const el = ref.current;

    const canAnimate =
      typeof IntersectionObserver !== 'undefined' && document.visibilityState === 'visible';

    if (!canAnimate) {
      // Can't animate reliably — show the content, un-armed, with no transition.
      setState({ armed: false, inView: true });
      return;
    }

    if (immediate) {
      // Arm (already armed from SSR) and reveal on the next frame.
      setState({ armed: true, inView: true });
      return;
    }

    if (!el) return;

    // Arm now (hide), then reveal when the element scrolls into view.
    setState({ armed: true, inView: false });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState({ armed: true, inView: true });
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);

    // If the tab is backgrounded before reveal, its IO callback never fires and
    // transitions freeze — un-arm so the content is shown rather than stranded.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setState({ armed: false, inView: true });
        observer.disconnect();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [margin, immediate]);

  return [ref, state] as const;
}

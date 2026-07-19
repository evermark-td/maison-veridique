'use client';

import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Travel distance in px. 0 = pure fade. */
  y?: number;
  /** Reveal on mount rather than on scroll into view. */
  immediate?: boolean;
  /** Rendered element. Defaults to div; use "li" inside lists. */
  as?: 'div' | 'li' | 'span';
};

/**
 * CSS-driven fade/rise reveal. The transition runs on the compositor, so it
 * completes even in a backgrounded tab where the JS animation loop is throttled.
 * IntersectionObserver (via useReveal) only toggles the `.is-visible` class.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
  y = 16,
  immediate = false,
  as: Component = 'div',
}: FadeInProps) {
  const [ref, { armed, inView }] = useReveal<HTMLElement>({ immediate });

  return (
    <Component
      ref={ref as React.Ref<never>}
      className={cn('reveal-item', armed && 'reveal-armed', inView && 'is-visible', className)}
      style={
        {
          '--reveal-y': `${y}px`,
          '--reveal-duration': `${duration}s`,
          '--reveal-delay': `${delay}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </Component>
  );
}

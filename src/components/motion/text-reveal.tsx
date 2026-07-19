'use client';

import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

type TextRevealProps = {
  /** Each entry becomes one masked line, revealed in sequence. */
  lines: React.ReactNode[];
  /** Rendered element for the outer wrapper. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  className?: string;
  lineClassName?: string;
  /** Seconds before the first line begins. */
  delay?: number;
  /** Seconds between successive lines. */
  stagger?: number;
  /** Reveal on mount (hero) rather than on scroll into view. */
  immediate?: boolean;
};

/**
 * Line-mask reveal: each line rides up out of an overflow-hidden clip, staggered
 * via CSS transition-delay. CSS-driven so it completes even in a backgrounded
 * tab; visibility is never dependent on the JS animation loop.
 */
export function TextReveal({
  lines,
  as: Component = 'div',
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
}: TextRevealProps) {
  const [ref, { armed, inView }] = useReveal<HTMLElement>({ margin: '-12% 0px', immediate });

  return (
    <Component
      ref={ref as React.Ref<never>}
      className={cn(armed && 'reveal-armed', inView && 'is-visible', className)}
    >
      {lines.map((line, index) => (
        <span key={index} className="reveal-line-mask block overflow-hidden">
          <span
            className={cn('reveal-line', lineClassName)}
            style={{ '--reveal-delay': `${delay + index * stagger}s` } as React.CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}

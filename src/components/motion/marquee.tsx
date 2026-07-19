'use client';

import { cn } from '@/lib/utils';

type MarqueeProps = {
  items: string[];
  /** Seconds for one full loop. */
  durationSeconds?: number;
  className?: string;
  itemClassName?: string;
  reverse?: boolean;
};

/**
 * Seamless CSS marquee. Two identical tracks translate by -50%; the second
 * fills the gap so the loop is unbroken. Pure CSS transform (no permanent
 * will-change), pauses on hover, and stops entirely under reduced-motion.
 */
export function Marquee({
  items,
  durationSeconds = 32,
  className,
  itemClassName,
  reverse = false,
}: MarqueeProps) {
  const Track = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <ul
      aria-hidden={ariaHidden}
      className={cn(
        'flex shrink-0 items-center gap-x-16 pr-16 motion-safe:animate-marquee',
        reverse && '[animation-direction:reverse]',
      )}
      style={{ animationDuration: `${durationSeconds}s` }}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={cn(
            'display shrink-0 text-2xl whitespace-nowrap text-foreground/45 sm:text-3xl',
            itemClassName,
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn(
        'group flex w-full overflow-hidden [--fade:5rem] [mask-image:linear-gradient(to_right,transparent,black_var(--fade),black_calc(100%_-_var(--fade)),transparent)]',
        className,
      )}
    >
      <div className="flex min-w-full shrink-0 [&:hover>ul]:[animation-play-state:paused]">
        <Track />
        <Track ariaHidden />
      </div>
    </div>
  );
}

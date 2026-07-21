import { TextReveal } from '@/components/motion/text-reveal';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow: string;
  lines: string[];
  /** Heading level. Use h1 only on standalone pages where this IS the page title. */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  headingClassName?: string;
  align?: 'left' | 'center';
};

/**
 * House section header: micro eyebrow above a masked display heading.
 * Reused across every marketing section.
 */
export function SectionHeading({
  eyebrow,
  lines,
  as = 'h2',
  className,
  headingClassName,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      <p className="label-micro">{eyebrow}</p>
      <TextReveal
        as={as}
        lines={lines}
        delay={0.05}
        className={cn('display mt-5 text-d3', headingClassName)}
      />
    </div>
  );
}

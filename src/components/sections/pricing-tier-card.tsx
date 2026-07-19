import Link from 'next/link';
import { Check } from 'lucide-react';

import { FadeIn } from '@/components/motion/fade-in';
import type { PricingTier } from '@/config/pricing';
import { cn } from '@/lib/utils';

type PricingTierCardProps = {
  tier: PricingTier;
  delay?: number;
};

export function PricingTierCard({ tier, delay = 0 }: PricingTierCardProps) {
  const { slug, name, tagline, priceLabel, features, isHighlighted } = tier;

  return (
    <FadeIn
      as="li"
      delay={delay}
      className={cn(
        'flex flex-col border p-8 lg:p-10',
        isHighlighted
          ? 'border-foreground bg-foreground text-background lg:-my-6 lg:py-14'
          : 'border-border bg-background text-foreground',
      )}
    >
      {isHighlighted ? (
        <p className="label-micro text-background/60">Most requested</p>
      ) : (
        <p className="label-micro text-muted-foreground">&nbsp;</p>
      )}

      <h3 className="display mt-4 text-d4">{name}</h3>
      <p
        className={cn(
          'mt-3 text-body',
          isHighlighted ? 'text-background/75' : 'text-muted-foreground',
        )}
      >
        {tagline}
      </p>

      <p className="label-micro mt-8">{priceLabel}</p>

      <ul className="mt-6 flex-1 space-y-3.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              className={cn(
                'mt-0.5 size-4 shrink-0',
                isHighlighted ? 'text-background' : 'text-accent',
              )}
              strokeWidth={1.5}
              aria-hidden
            />
            <span
              className={cn(
                'text-body',
                isHighlighted ? 'text-background/90' : 'text-foreground/80',
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={`/appointments?tier=${slug}`}
        className={cn(
          'group mt-10 inline-flex items-center gap-3 text-micro font-medium uppercase tracking-[0.16em]',
        )}
      >
        <span className="relative">
          Request an appointment
          <span
            className={cn(
              'absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0',
              isHighlighted ? 'bg-background' : 'bg-foreground',
            )}
          />
        </span>
        <span
          aria-hidden
          className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5"
        >
          →
        </span>
      </Link>
    </FadeIn>
  );
}

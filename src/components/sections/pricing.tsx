import { FadeIn } from '@/components/motion/fade-in';
import { PricingTierCard } from '@/components/sections/pricing-tier-card';
import { SectionHeading } from '@/components/sections/section-heading';
import type { PricingContent } from '@/config/pricing';

export function Pricing({ content }: { content: PricingContent }) {
  const { eyebrow, headingLines, intro, tiers, footnote } = content;

  return (
    <section aria-labelledby="pricing-heading" className="border-t border-border bg-background">
      <div className="container-page py-24 lg:py-36">
        <div className="grid grid-cols-1 items-end gap-x-16 gap-y-8 lg:grid-cols-12">
          <SectionHeading
            eyebrow={eyebrow}
            lines={headingLines}
            className="lg:col-span-7"
            headingClassName="text-d2"
          />
          <span id="pricing-heading" className="sr-only">
            {headingLines.join(' ')}
          </span>

          <FadeIn className="lg:col-span-5 lg:pb-3" delay={0.1}>
            <p className="max-w-md text-body text-muted-foreground lg:ml-auto">{intro}</p>
          </FadeIn>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-8 lg:mt-24 lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier, index) => (
            <PricingTierCard key={tier.slug} tier={tier} delay={index * 0.08} />
          ))}
        </ul>

        <FadeIn delay={0.2}>
          <p className="mt-12 max-w-2xl text-caption text-muted-foreground lg:mt-16">
            {footnote}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { ParallaxImage } from '@/components/motion/parallax-image';
import { SectionHeading } from '@/components/sections/section-heading';
import type { FeaturesContent } from '@/config/features';

export function Features({ content }: { content: FeaturesContent }) {
  const { eyebrow, headingLines, intro, cta, image, pillars } = content;

  return (
    <section
      aria-labelledby="features-heading"
      className="bg-background text-foreground"
    >
      <div className="container-page grid grid-cols-1 gap-x-16 gap-y-14 py-24 lg:grid-cols-12 lg:py-36">
        {/* Left rail — heading, intro, image */}
        <div className="lg:col-span-6 lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow={eyebrow}
            lines={headingLines}
            headingClassName="max-w-xl"
          />
          <span id="features-heading" className="sr-only">
            {headingLines.join(' ')}
          </span>

          <FadeIn className="mt-8 max-w-md" delay={0.1}>
            <p className="text-body text-muted-foreground">{intro}</p>
          </FadeIn>

          <FadeIn className="mt-8" delay={0.18}>
            <Link
              href={cta.href}
              className="group inline-flex items-center gap-3 text-micro font-medium uppercase tracking-[0.16em]"
            >
              <span className="relative">
                {cta.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
              </span>
              <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </FadeIn>

          <FadeIn className="mt-14 hidden lg:block" delay={0.1} y={0}>
            <ParallaxImage
              src={image.src}
              alt={image.alt}
              sizes="(min-width: 1024px) 42vw, 100vw"
              ratioClassName="aspect-4/5"
            />
          </FadeIn>
        </div>

        {/* Right rail — pillars */}
        <ol className="lg:col-span-6 lg:col-start-8">
          {pillars.map((pillar, index) => (
            <FadeIn
              as="li"
              key={pillar.index}
              delay={index * 0.06}
              className="hairline flex gap-6 py-10 first:border-t-0 first:pt-0 sm:gap-10 lg:py-12"
            >
              <span className="display text-d4 leading-none text-stone">{pillar.index}</span>
              <div>
                <h3 className="display text-d4">{pillar.title}</h3>
                <p className="mt-4 max-w-md text-body text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </FadeIn>
          ))}

          {/* Mobile image — appears after the list on small screens */}
          <li className="mt-14 lg:hidden">
            <ParallaxImage
              src={image.src}
              alt={image.alt}
              sizes="100vw"
              ratioClassName="aspect-4/5"
            />
          </li>
        </ol>
      </div>
    </section>
  );
}

import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { ParallaxImage } from '@/components/motion/parallax-image';
import { CollectionCard } from '@/components/sections/collection-card';
import { SectionHeading } from '@/components/sections/section-heading';
import type { PortfolioContent } from '@/config/collections';

export function Portfolio({ content }: { content: PortfolioContent }) {
  const { eyebrow, headingLines, intro, cta, featured, collections } = content;
  const featuredHref = `/collections/${featured.slug}`;

  return (
    // Opaque tint (paper + bone blend) — no transparency in the scroll stack,
    // so nothing beneath can bleed through the section ground.
    <section
      aria-labelledby="portfolio-heading"
      className="border-t border-border bg-[#f5f3ef]"
    >
      <div className="container-page py-24 lg:py-36">
        {/* Header */}
        <div className="grid grid-cols-1 items-end gap-x-16 gap-y-8 lg:grid-cols-12">
          <SectionHeading
            eyebrow={eyebrow}
            lines={headingLines}
            className="lg:col-span-8"
            headingClassName="text-d2"
          />
          <span id="portfolio-heading" className="sr-only">
            {headingLines.join(' ')}
          </span>

          <FadeIn className="lg:col-span-4 lg:pb-3" delay={0.1}>
            <p className="max-w-md text-body text-muted-foreground lg:ml-auto">{intro}</p>
          </FadeIn>
        </div>

        {/* Featured collection */}
        <FadeIn className="mt-16 lg:mt-24" y={0}>
          <Link
            href={featuredHref}
            className="group grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-12 lg:items-center"
          >
            <div className="lg:col-span-7">
              <ParallaxImage
                src={featured.image.src}
                alt={featured.image.alt}
                sizes="(min-width: 1024px) 58vw, 100vw"
                ratioClassName="aspect-[4/3] lg:aspect-[16/11]"
              />
            </div>

            <div className="lg:col-span-5 lg:pl-4">
              <p className="label-micro text-accent">Current season</p>
              <div className="mt-5 flex items-baseline gap-4">
                <p className="label-micro">
                  {featured.season} <span className="text-foreground/40">·</span> {featured.year}
                </p>
                <span aria-hidden className="h-px w-10 bg-border" />
                <p className="label-micro">{featured.pieceCount} pieces</p>
              </div>

              <h3 className="display mt-4 text-d3">{featured.title}</h3>
              <p className="mt-5 max-w-md text-lead text-muted-foreground">
                {featured.description}
              </p>

              <span className="mt-8 inline-flex items-center gap-3 text-micro font-medium uppercase tracking-[0.16em]">
                <span className="relative">
                  Explore the collection
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        </FadeIn>

        {/* Staggered archive grid */}
        <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3 lg:gap-x-12">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.slug}
              collection={collection}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              offset={index === 1}
              delay={index * 0.08}
            />
          ))}
        </ul>

        {/* Footer CTA */}
        <FadeIn className="mt-20 flex justify-center lg:mt-28">
          <Link
            href={cta.href}
            className="group inline-flex items-center gap-3 border border-foreground px-10 py-4 text-micro font-medium uppercase tracking-[0.16em] transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-foreground hover:text-background"
          >
            {cta.label}
            <span
              aria-hidden
              className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

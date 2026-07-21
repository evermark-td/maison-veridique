import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { Features } from '@/components/sections/features';
import { TextReveal } from '@/components/motion/text-reveal';
import { featuresContent } from '@/config/features';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'The Atelier',
  description:
    'Inside the Maison Véridique atelier — rare cloth, single-hand cutting and construction meant to last decades.',
  path: '/atelier',
});

export default function AtelierPage() {
  return (
    <>
      <div className="container-page pt-16 lg:pt-24">
        <p className="label-micro">The House</p>
        <TextReveal
          as="h1"
          immediate
          delay={0.1}
          lines={['Where the work', 'is done.']}
          className="display mt-5 text-d2"
        />
        <FadeIn immediate delay={0.25}>
          <p className="mt-6 max-w-2xl text-lead text-muted-foreground">
            Every garment the house releases passes through one Paris atelier — fourteen hands,
            one floor, no assembly line. This is what that means in practice.
          </p>
        </FadeIn>
      </div>

      <Features content={featuresContent} />

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start gap-6 py-20 lg:py-28">
          <p className="label-micro">Visit</p>
          <p className="display max-w-2xl text-d3">
            The atelier receives clients by appointment only.
          </p>
          <FadeIn delay={0.1}>
            <Link
              href="/appointments"
              className="group inline-flex items-center gap-3 border border-foreground px-10 py-4 text-micro font-medium uppercase tracking-[0.16em] transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-foreground hover:text-background"
            >
              Book a private appointment
              <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </>
  );
}

import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { TextReveal } from '@/components/motion/text-reveal';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Boutiques',
  description: 'The boutiques of Maison Véridique — Paris, Milan and Tokyo.',
  path: '/boutiques',
});

export const revalidate = 3600;

export default async function BoutiquesPage() {
  const boutiques = await prisma.boutique.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container-page py-16 lg:py-24">
      <p className="label-micro">The House</p>
      <TextReveal
        as="h1"
        immediate
        delay={0.1}
        lines={['Three cities,', 'one standard.']}
        className="display mt-5 text-d2"
      />
      <FadeIn immediate delay={0.25}>
        <p className="mt-6 max-w-xl text-lead text-muted-foreground">
          Each boutique holds the full seasonal collection and receives bespoke clients by
          appointment. Monday to Saturday, 10.00 – 19.00 local time.
        </p>
      </FadeIn>

      <ul className="mt-16 lg:mt-20">
        {boutiques.map((boutique, index) => (
          <FadeIn
            as="li"
            key={boutique.id}
            delay={index * 0.06}
            className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-border py-10 lg:grid-cols-12 lg:items-baseline"
          >
            <h2 className="display text-d3 lg:col-span-4">{boutique.city}</h2>
            <div className="lg:col-span-5">
              <p className="text-body text-foreground/85">{boutique.name}</p>
              <p className="mt-1 text-body text-muted-foreground">
                {boutique.address}, {boutique.city}, {boutique.country}
              </p>
            </div>
            <div className="lg:col-span-3 lg:justify-self-end">
              {boutique.phone ? (
                <Link
                  href={`tel:${boutique.phone.replace(/\s/g, '')}`}
                  className="text-body text-foreground/75 transition-colors duration-300 hover:text-foreground"
                >
                  {boutique.phone}
                </Link>
              ) : null}
            </div>
          </FadeIn>
        ))}
      </ul>

      <FadeIn delay={0.1}>
        <div className="mt-16 border-t border-border pt-10">
          <p className="max-w-md text-body text-muted-foreground">
            Travelling elsewhere? The house visits clients by arrangement.
          </p>
          <Link
            href="/appointments"
            className="group mt-6 inline-flex items-center gap-3 text-micro font-medium uppercase tracking-[0.16em]"
          >
            <span className="relative">
              Request an appointment
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
            </span>
            <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

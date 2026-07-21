import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { SectionHeading } from '@/components/sections/section-heading';
import { getPublishedCollections } from '@/lib/queries/catalogue';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Collections',
  description:
    'The seasons of Maison Véridique — closed editions of ready-to-wear, cut in limited lengths and never restocked.',
  path: '/collections',
});

// Revalidated on-demand by the admin actions; time-based as a safety net.
export const revalidate = 300;

export default async function CollectionsPage() {
  const collections = await getPublishedCollections();

  return (
    <div className="container-page py-16 lg:py-24">
      <SectionHeading
        as="h1"
        eyebrow="The Collections"
        lines={['Closed editions,', 'season by season.']}
        headingClassName="text-d2"
      />

      {collections.length === 0 ? (
        <FadeIn delay={0.1}>
          <p className="mt-12 max-w-md text-lead text-muted-foreground">
            The next season is being prepared in the atelier. Enquire for a private preview.
          </p>
          <Link
            href="/#contact-heading"
            className="group mt-8 inline-flex items-center gap-3 text-micro font-medium tracking-[0.16em] uppercase"
          >
            <span className="relative">
              Speak with the house
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
            </span>
            <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </FadeIn>
      ) : (
        <ul className="mt-16 lg:mt-20">
          {collections.map((collection, index) => (
            <FadeIn as="li" key={collection.id} delay={index * 0.06}>
              <Link
                href={`/collections/${collection.slug}`}
                className="group grid grid-cols-1 gap-x-10 gap-y-3 border-t border-border py-10 transition-colors duration-300 lg:grid-cols-12 lg:items-baseline lg:py-12"
              >
                <p className="label-micro lg:col-span-3">
                  {collection.season}
                  {collection.year ? ` · ${collection.year}` : ''}
                </p>

                <div className="lg:col-span-6">
                  <h2 className="display text-d3">
                    <span className="relative inline-block">
                      {collection.title}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
                    </span>
                  </h2>
                  {collection.subtitle ? (
                    <p className="mt-3 max-w-md text-body text-muted-foreground">
                      {collection.subtitle}
                    </p>
                  ) : null}
                </div>

                <p className="label-micro lg:col-span-3 lg:justify-self-end">
                  {collection._count.products}{' '}
                  {collection._count.products === 1 ? 'piece' : 'pieces'}
                </p>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}

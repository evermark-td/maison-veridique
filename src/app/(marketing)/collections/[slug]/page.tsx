import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FadeIn } from '@/components/motion/fade-in';
import { TextReveal } from '@/components/motion/text-reveal';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd } from '@/lib/jsonld';
import { getPublishedCollectionBySlug } from '@/lib/queries/catalogue';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getPublishedCollectionBySlug(slug);
  if (!collection) return buildMetadata({ title: 'Collections', path: '/collections' });

  return buildMetadata({
    title: collection.title,
    description:
      collection.description ??
      `${collection.title} — a closed edition from Maison Véridique.`,
    path: `/collections/${collection.slug}`,
  });
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = await getPublishedCollectionBySlug(slug);

  // Unknown or unpublished — identical 404 either way, so drafts don't leak
  // their existence.
  if (!collection) notFound();

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Collections', path: '/collections' },
    { name: collection.title, path: `/collections/${collection.slug}` },
  ]);

  return (
    <div className="container-page py-16 lg:py-24">
      <JsonLd data={breadcrumbs} />
      {/* Header */}
      <div className="max-w-3xl">
        <FadeIn immediate y={0}>
          <p className="label-micro">
            <Link href="/collections" className="transition-colors duration-300 hover:text-foreground">
              Collections
            </Link>
            <span aria-hidden className="text-foreground/40"> / </span>
            {collection.season}
            {collection.year ? ` · ${collection.year}` : ''}
          </p>
        </FadeIn>

        <TextReveal
          as="h1"
          immediate
          delay={0.1}
          lines={[collection.title]}
          className="display mt-5 text-d2"
        />

        {collection.subtitle ? (
          <FadeIn immediate delay={0.2}>
            <p className="mt-5 text-lead text-muted-foreground">{collection.subtitle}</p>
          </FadeIn>
        ) : null}

        {collection.description ? (
          <FadeIn immediate delay={0.28}>
            <p className="mt-6 max-w-2xl text-body text-foreground/80">{collection.description}</p>
          </FadeIn>
        ) : null}
      </div>

      {/* Pieces */}
      {collection.products.length === 0 ? (
        <FadeIn delay={0.1}>
          <p className="mt-16 max-w-md border-t border-border pt-10 text-body text-muted-foreground">
            The pieces of this collection are being photographed. Enquire for a private
            presentation ahead of release.
          </p>
        </FadeIn>
      ) : (
        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-x-12">
          {collection.products.map((product, index) => (
            <FadeIn as="li" key={product.id} delay={(index % 3) * 0.06}>
              <Link href={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-4/5 overflow-hidden bg-bone">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].media.url}
                      alt={product.images[0].alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-luxe)] group-hover:scale-[1.03]"
                      {...(product.images[0].media.blurDataUrl
                        ? { placeholder: 'blur' as const, blurDataURL: product.images[0].media.blurDataUrl }
                        : {})}
                    />
                  ) : (
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                      <span className="label-micro">{collection.season ?? 'The House'}</span>
                      {product.isFeatured ? <span className="label-micro">Featured</span> : null}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h2 className="display text-d4">
                    <span className="relative inline-block">
                      {product.name}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
                    </span>
                  </h2>
                  <p className="shrink-0 text-body font-medium">
                    {formatPrice(Number(product.basePrice), product.currency)}
                  </p>
                </div>
                <p className="mt-2 max-w-sm text-caption text-muted-foreground">
                  {product.description}
                </p>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}

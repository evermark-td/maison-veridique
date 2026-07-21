import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FadeIn } from '@/components/motion/fade-in';
import { TextReveal } from '@/components/motion/text-reveal';
import { ProductPurchase } from '@/components/product/product-purchase';
import { WishlistButton } from '@/components/product/wishlist-button';
import { JsonLd } from '@/components/seo/json-ld';
import { getCurrentUser } from '@/lib/auth';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/jsonld';
import { prisma } from '@/lib/prisma';
import { getPublishedProductBySlug } from '@/lib/queries/catalogue';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

// Dynamic: the wishlist state is per-user (reads the session).
export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);
  if (!product) return buildMetadata({ title: 'Collections', path: '/collections' });

  return buildMetadata({
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) notFound();

  const user = await getCurrentUser();
  const saved = user
    ? Boolean(
        await prisma.wishlistItem.findUnique({
          where: { userId_productId: { userId: user.id, productId: product.id } },
          select: { id: true },
        }),
      )
    : false;

  const leadImage = product.images[0];

  const details = [
    { label: 'Composition', value: product.composition },
    { label: 'Care', value: product.careInstructions },
    {
      label: 'Collection',
      value: product.collection
        ? `${product.collection.title}${product.collection.year ? `, ${product.collection.year}` : ''}`
        : null,
      href: product.collection ? `/collections/${product.collection.slug}` : undefined,
    },
  ].filter((d) => d.value);

  const inStock = product.variants.some((variant) => variant.stock > 0);

  const structuredData = [
    productJsonLd({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.basePrice),
      currency: product.currency,
      imageUrl: leadImage?.media.url,
      inStock,
    }),
    breadcrumbJsonLd([
      { name: 'Collections', path: '/collections' },
      ...(product.collection
        ? [{ name: product.collection.title, path: `/collections/${product.collection.slug}` }]
        : []),
      { name: product.name, path: `/products/${product.slug}` },
    ]),
  ];

  return (
    <div className="container-page py-16 lg:py-24">
      <JsonLd data={structuredData} />
      <article className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <FadeIn immediate y={0}>
          <p className="label-micro">
            <Link href="/collections" className="transition-colors duration-300 hover:text-foreground">
              Collections
            </Link>
            {product.collection ? (
              <>
                <span aria-hidden className="text-foreground/40"> / </span>
                <Link
                  href={`/collections/${product.collection.slug}`}
                  className="transition-colors duration-300 hover:text-foreground"
                >
                  {product.collection.title}
                </Link>
              </>
            ) : null}
          </p>
        </FadeIn>

        <TextReveal
          as="h1"
          immediate
          delay={0.1}
          lines={[product.name]}
          className="display mt-5 text-d2 [text-wrap:balance]"
        />

        <FadeIn immediate delay={0.2}>
          <div className="mt-5 flex items-center justify-between gap-6">
            <p className="text-lead font-medium">
              {formatPrice(Number(product.basePrice), product.currency)}
            </p>
            <WishlistButton productId={product.id} initialSaved={saved} isSignedIn={Boolean(user)} />
          </div>
        </FadeIn>

        <FadeIn immediate delay={0.28}>
          <p className="mt-8 text-lead text-foreground/85">{product.description}</p>
        </FadeIn>

        {product.variants.length > 0 ? (
          <FadeIn immediate delay={0.34}>
            <ProductPurchase variants={product.variants} />
          </FadeIn>
        ) : null}

        {leadImage ? (
          <FadeIn delay={0.05}>
            <div className="mt-12 space-y-6">
              {/* Lead image, full column width */}
              <div className="relative aspect-4/5 overflow-hidden bg-bone">
                <Image
                  src={leadImage.media.url}
                  alt={leadImage.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 48rem, 100vw"
                  className="object-cover"
                  {...(leadImage.media.blurDataUrl
                    ? { placeholder: 'blur' as const, blurDataURL: leadImage.media.blurDataUrl }
                    : {})}
                />
              </div>

              {product.images.length > 1 ? (
                <div className="grid grid-cols-2 gap-6">
                  {product.images.slice(1).map((image) => (
                    <div key={image.id} className="relative aspect-4/5 overflow-hidden bg-bone">
                      <Image
                        src={image.media.url}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 24rem, 50vw"
                        className="object-cover"
                        {...(image.media.blurDataUrl
                          ? { placeholder: 'blur' as const, blurDataURL: image.media.blurDataUrl }
                          : {})}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </FadeIn>
        ) : null}

        {product.story ? (
          <FadeIn delay={0.1}>
            <div className="mt-12 border-t border-border pt-10">
              <p className="label-micro">The story</p>
              <p className="mt-4 whitespace-pre-line text-body text-foreground/80">
                {product.story}
              </p>
            </div>
          </FadeIn>
        ) : null}

        {details.length > 0 ? (
          <FadeIn delay={0.12}>
            <dl className="mt-12 border-t border-border">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="grid grid-cols-1 gap-x-10 gap-y-1 border-b border-border py-5 sm:grid-cols-12"
                >
                  <dt className="label-micro sm:col-span-4">{detail.label}</dt>
                  <dd className="text-body text-foreground/80 sm:col-span-8">
                    {detail.href ? (
                      <Link
                        href={detail.href}
                        className="transition-colors duration-300 hover:text-foreground"
                      >
                        {detail.value}
                      </Link>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        ) : null}

        {/* Pieces without variants are enquiry-led — a client advisor arranges them. */}
        {product.variants.length === 0 ? (
          <FadeIn delay={0.15}>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-border pt-10">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 border border-foreground px-10 py-4 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-foreground hover:text-background"
              >
                Enquire about this piece
                <span
                  aria-hidden
                  className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
              <p className="max-w-xs text-caption text-muted-foreground">
                A client advisor will confirm sizing, cloth availability and delivery.
              </p>
            </div>
          </FadeIn>
        ) : null}
      </article>
    </div>
  );
}

import Link from 'next/link';

import { WishlistItemCard, type WishlistProduct } from '@/components/account/wishlist-item';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'Wishlist', path: '/account/wishlist', noIndex: true });

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await getCurrentUser();

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user!.id },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          slug: true,
          name: true,
          basePrice: true,
          currency: true,
          isPublished: true,
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
            select: { alt: true, media: { select: { url: true, blurDataUrl: true } } },
          },
        },
      },
    },
  });

  // Only surface pieces still published — a wishlisted item can be unpublished.
  const products: WishlistProduct[] = items
    .filter((item) => item.product.isPublished)
    .map((item) => {
      const lead = item.product.images[0];
      return {
        productId: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        price: Number(item.product.basePrice),
        currency: item.product.currency,
        image: lead
          ? { url: lead.media.url, alt: lead.alt, blurDataURL: lead.media.blurDataUrl ?? undefined }
          : null,
      };
    });

  if (products.length === 0) {
    return (
      <div className="max-w-md">
        <p className="text-body text-muted-foreground">
          Nothing saved yet. Tap “Save” on any piece to keep it here.
        </p>
        <Link
          href="/collections"
          className="group mt-6 inline-flex items-center gap-3 text-micro font-medium tracking-[0.16em] uppercase"
        >
          <span className="relative">
            View the collections
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
          </span>
          <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
      {products.map((product) => (
        <WishlistItemCard key={product.productId} product={product} />
      ))}
    </ul>
  );
}

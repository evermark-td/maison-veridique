import { prisma } from '@/lib/prisma';

/**
 * Public catalogue reads. Every query filters on `isPublished` at the database
 * level — draft content must never be reachable, even by a guessed URL.
 */

export function getPublishedCollections() {
  return prisma.collection.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
    include: {
      _count: { select: { products: { where: { isPublished: true } } } },
    },
  });
}

/**
 * Homepage portfolio: published collections with their published-piece count
 * and a representative image (the lead image of their first published product,
 * until dedicated collection heroes exist).
 */
export function getHomeCollections() {
  return prisma.collection.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
    take: 4,
    include: {
      _count: { select: { products: { where: { isPublished: true } } } },
      products: {
        where: { isPublished: true, images: { some: {} } },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: 1,
        select: {
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
            select: { alt: true, media: { select: { url: true, blurDataUrl: true } } },
          },
        },
      },
    },
  });
}

export function getPublishedCollectionBySlug(slug: string) {
  return prisma.collection.findFirst({
    where: { slug, isPublished: true },
    include: {
      products: {
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          basePrice: true,
          currency: true,
          isFeatured: true,
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
            select: {
              alt: true,
              media: { select: { url: true, blurDataUrl: true } },
            },
          },
        },
      },
    },
  });
}

export function getPublishedProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
    include: {
      collection: { select: { slug: true, title: true, season: true, year: true } },
      images: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          alt: true,
          media: { select: { url: true, blurDataUrl: true, width: true, height: true } },
        },
      },
      variants: {
        where: { isActive: true },
        orderBy: [{ colorName: 'asc' }, { size: 'asc' }],
        select: {
          id: true,
          colorName: true,
          colorHex: true,
          size: true,
          stock: true,
        },
      },
    },
  });
}

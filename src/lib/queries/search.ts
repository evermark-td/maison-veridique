import { prisma } from '@/lib/prisma';

/** Public search across published products and collections. */
export async function search(query: string) {
  const q = query.trim();
  if (q.length < 2) return { products: [], collections: [] };

  const [products, collections] = await Promise.all([
    prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { composition: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 24,
      select: {
        id: true,
        slug: true,
        name: true,
        basePrice: true,
        currency: true,
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: { alt: true, media: { select: { url: true, blurDataUrl: true } } },
        },
      },
    }),
    prisma.collection.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { subtitle: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
      take: 8,
      select: { id: true, slug: true, title: true, season: true, year: true },
    }),
  ]);

  return { products, collections };
}

import type { MetadataRoute } from 'next';

import { LEGAL_DOCS } from '@/config/legal';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/seo';

// Regenerated on demand by revalidation elsewhere; time-based fallback here.
export const revalidate = 3600;

/**
 * Every route search engines should know about — the static marketing pages
 * plus dynamic entries pulled live from published catalogue and journal rows.
 */

type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/collections', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/atelier', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/journal', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/boutiques', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/appointments', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/size-guide', changeFrequency: 'yearly', priority: 0.4 },
  ...Object.keys(LEGAL_DOCS).map((slug): StaticRoute => ({
    path: `/legal/${slug}`,
    changeFrequency: 'yearly',
    priority: 0.3,
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Published entities only — never advertise drafts to search engines.
  const [collections, products, journal] = await Promise.all([
    prisma.collection.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.journalPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
    }),
  ]);

  const statik: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${siteConfig.url}/collections/${collection.slug}`,
    lastModified: collection.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const journalEntries: MetadataRoute.Sitemap = journal.map((post) => ({
    url: `${siteConfig.url}/journal/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...statik, ...collectionEntries, ...productEntries, ...journalEntries];
}

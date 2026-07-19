import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/seo';

const staticRoutes = [
  '',
  '/collections',
  '/lookbook',
  '/atelier',
  '/services',
  '/journal',
  '/boutiques',
  '/appointments',
  '/faq',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Dynamic product / collection / journal entries are appended in Phase 4,
  // once those tables are populated.
  return staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}

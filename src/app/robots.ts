import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/seo';

// Every disallowed prefix here mirrors a page whose `buildMetadata` call sets
// `noIndex: true` — this file is the crawler-directive expression of that.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/admin', '/api', '/auth', '/cart', '/checkout', '/search'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

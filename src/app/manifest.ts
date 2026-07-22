import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/seo';

// `display: 'browser'` deliberately keeps the URL bar visible — the house is a
// shop, not an app, and clients still expect to see the address they are on.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Véridique',
    description: siteConfig.description,
    start_url: '/',
    display: 'browser',
    background_color: '#FAF9F7',
    theme_color: '#FAF9F7',
    lang: 'en-GB',
    categories: ['shopping', 'lifestyle'],
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}

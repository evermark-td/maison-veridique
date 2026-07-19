import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Maison Véridique',
  shortName: 'VÉRIDIQUE',
  tagline: 'Considered luxury, made to endure.',
  description:
    'Maison Véridique is a Parisian house of ready-to-wear and bespoke tailoring. Rare materials, exacting craft, collections released twice a year.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'en_GB',
  social: {
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
  },
} as const;

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image,
  noIndex = false,
}: SeoInput = {}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? `${siteConfig.url}/opengraph-image`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: title ? `${title} — ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: title ?? siteConfig.name,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? siteConfig.name,
      description,
      images: [ogImage],
    },
  };
}

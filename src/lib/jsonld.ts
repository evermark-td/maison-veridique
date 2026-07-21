import { siteConfig } from '@/lib/seo';

/**
 * Structured-data builders used by pages to add JSON-LD for search engines.
 * Each returns a plain object; render with the <JsonLd> component (below).
 *
 * References:
 *  - Product     — https://schema.org/Product
 *  - Article     — https://schema.org/Article
 *  - Breadcrumb  — https://schema.org/BreadcrumbList
 *  - WebSite     — https://schema.org/WebSite  (+ SearchAction for sitelinks search)
 */

const absolute = (path: string) =>
  path.startsWith('http') ? path : `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  description: siteConfig.description,
  sameAs: [siteConfig.social.instagram, siteConfig.social.pinterest],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export type ProductJsonLdInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  inStock: boolean;
  sku?: string;
  brand?: string;
};

/**
 * Product structured data. `availability` is the strict Google-supported enum;
 * `price` requires a fixed decimal, so we render it as a string with two places.
 */
export function productJsonLd(input: ProductJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    ...(input.imageUrl ? { image: [absolute(input.imageUrl)] } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    brand: { '@type': 'Brand', name: input.brand ?? siteConfig.name },
    offers: {
      '@type': 'Offer',
      url: absolute(`/products/${input.slug}`),
      price: input.price.toFixed(2),
      priceCurrency: input.currency,
      availability: input.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

export type ArticleJsonLdInput = {
  headline: string;
  slug: string;
  description: string;
  datePublished: Date | null;
  dateModified?: Date | null;
  authorName?: string | null;
};

export function articleJsonLd(input: ArticleJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absolute(`/journal/${input.slug}`),
    },
    ...(input.datePublished ? { datePublished: input.datePublished.toISOString() } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified.toISOString() } : {}),
    ...(input.authorName ? { author: { '@type': 'Person', name: input.authorName } } : {}),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

/** Ordered breadcrumb trail — first item is typically Home. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}


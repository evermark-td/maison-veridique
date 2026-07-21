import Image from 'next/image';
import Link from 'next/link';

import { SearchField } from '@/components/shop/search-field';
import { search } from '@/lib/queries/search';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Search', path: '/search', noIndex: true });

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const { products, collections } = await search(query);
  const hasQuery = query.length >= 2;
  const total = products.length + collections.length;

  return (
    <div className="container-page py-16 lg:py-24">
      <h1 className="label-micro">Search</h1>
      <div className="mt-6 max-w-2xl">
        <SearchField initialQuery={query} />
      </div>

      {!hasQuery ? (
        <p className="mt-10 text-body text-muted-foreground">
          Search the house by piece, cloth or collection.
        </p>
      ) : total === 0 ? (
        <p className="mt-10 max-w-md text-body text-muted-foreground">
          Nothing matched “{query}”. Try a broader term, or explore the{' '}
          <Link href="/collections" className="border-b border-foreground/60 text-foreground transition-colors duration-300 hover:border-foreground">
            collections
          </Link>
          .
        </p>
      ) : (
        <div className="mt-12 space-y-16">
          {collections.length > 0 ? (
            <section>
              <p className="label-micro">Collections</p>
              <ul className="mt-5 divide-y divide-border border-t border-border">
                {collections.map((collection) => (
                  <li key={collection.id}>
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="flex items-baseline justify-between gap-6 py-5 transition-colors duration-300 hover:text-accent"
                    >
                      <span className="display text-d4">{collection.title}</span>
                      <span className="label-micro">
                        {collection.season}
                        {collection.year ? ` · ${collection.year}` : ''}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {products.length > 0 ? (
            <section>
              <p className="label-micro">
                Pieces <span className="text-foreground/60">({products.length})</span>
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
                {products.map((product) => {
                  const lead = product.images[0];
                  return (
                    <li key={product.id}>
                      <Link href={`/products/${product.slug}`} className="group block">
                        <div className="relative aspect-4/5 overflow-hidden bg-bone">
                          {lead ? (
                            <Image
                              src={lead.media.url}
                              alt={lead.alt}
                              fill
                              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                              className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-luxe)] group-hover:scale-[1.03]"
                              {...(lead.media.blurDataUrl
                                ? { placeholder: 'blur' as const, blurDataURL: lead.media.blurDataUrl }
                                : {})}
                            />
                          ) : null}
                        </div>
                        <div className="mt-4 flex items-baseline justify-between gap-4">
                          <h2 className="display text-d4">{product.name}</h2>
                          <p className="shrink-0 text-body font-medium tabular-nums">
                            {formatPrice(Number(product.basePrice), product.currency)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';

import { CollectionRowActions } from '@/components/admin/collection-row-actions';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDate } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Collections — Admin',
  path: '/admin/collections',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-micro">Collections</p>
          <h1 className="display mt-3 text-d3">The seasons.</h1>
        </div>
        <Link
          href="/admin/collections/new"
          className="border border-foreground px-6 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          New collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <p className="mt-12 max-w-md text-body text-muted-foreground">
          No collections yet. Create the first season to begin building the catalogue.
        </p>
      ) : (
        <ul className="mt-10">
          {collections.map((collection) => (
            <li
              key={collection.id}
              className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-border py-6 lg:grid-cols-12 lg:items-center"
            >
              <div className="lg:col-span-5">
                <p className="display text-d4">{collection.title}</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  /{collection.slug}
                  {collection.season ? ` · ${collection.season}` : ''}
                  {collection.year ? ` ${collection.year}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-4 lg:col-span-4">
                <span
                  className={cn(
                    'inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase',
                    collection.isPublished
                      ? 'bg-foreground text-background'
                      : 'border border-border text-muted-foreground',
                  )}
                >
                  {collection.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className="label-micro">{collection._count.products} pieces</span>
                {collection.publishedAt ? (
                  <span className="label-micro">· {formatDate(collection.publishedAt)}</span>
                ) : null}
              </div>

              <div className="lg:col-span-3 lg:justify-self-end">
                <CollectionRowActions id={collection.id} isPublished={collection.isPublished} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

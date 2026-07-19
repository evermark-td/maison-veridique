import Link from 'next/link';

import { ProductRowActions } from '@/components/admin/product-row-actions';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn, formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Products — Admin',
  path: '/admin/products',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: {
      collection: { select: { title: true } },
      _count: { select: { variants: true } },
    },
  });

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-micro">Products</p>
          <h1 className="display mt-3 text-d3">The pieces.</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="border border-foreground px-6 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          New piece
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-12 max-w-md text-body text-muted-foreground">
          No pieces yet. Create the first garment to begin the catalogue.
        </p>
      ) : (
        <ul className="mt-10">
          {products.map((product) => (
            <li
              key={product.id}
              className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-border py-6 lg:grid-cols-12 lg:items-center"
            >
              <div className="lg:col-span-4">
                <p className="display text-d4">{product.name}</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  /{product.slug}
                  {product.collection ? ` · ${product.collection.title}` : ''}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 lg:col-span-5">
                <span className="text-body font-medium">
                  {formatPrice(Number(product.basePrice), product.currency)}
                </span>
                <span
                  className={cn(
                    'inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase',
                    product.isPublished
                      ? 'bg-foreground text-background'
                      : 'border border-border text-muted-foreground',
                  )}
                >
                  {product.isPublished ? 'Published' : 'Draft'}
                </span>
                {product.isFeatured ? <span className="label-micro">Featured</span> : null}
                <span className="label-micro">{product._count.variants} variants</span>
              </div>

              <div className="lg:col-span-3 lg:justify-self-end">
                <ProductRowActions id={product.id} isPublished={product.isPublished} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

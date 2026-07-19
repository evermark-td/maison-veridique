import { ProductForm } from '@/components/admin/product-form';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'New Product — Admin',
  path: '/admin/products/new',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const collections = await prisma.collection.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, title: true },
  });

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Products</p>
      <h1 className="display mt-3 text-d3">A new piece.</h1>
      <div className="mt-10">
        <ProductForm collections={collections} />
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';

import { ProductForm } from '@/components/admin/product-form';
import { ProductMediaManager } from '@/components/admin/product-media-manager';
import { ProductVariantManager } from '@/components/admin/product-variant-manager';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Edit Product — Admin',
  path: '/admin/products',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          include: { media: { select: { url: true, width: true, height: true } } },
        },
        variants: {
          orderBy: [{ colorName: 'asc' }, { size: 'asc' }],
        },
      },
    }),
    prisma.collection.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, title: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Products</p>
      <h1 className="display mt-3 text-d3">{product.name}</h1>
      <p className="mt-2 text-caption text-muted-foreground">/{product.slug}</p>

      <div className="mt-10">
        <ProductForm
          productId={product.id}
          collections={collections}
          defaultValues={{
            name: product.name,
            description: product.description,
            story: product.story ?? '',
            composition: product.composition ?? '',
            careInstructions: product.careInstructions ?? '',
            basePrice: Number(product.basePrice),
            currency: product.currency as 'EUR' | 'USD' | 'GBP',
            collectionId: product.collectionId ?? undefined,
            isFeatured: product.isFeatured,
            isPublished: product.isPublished,
            sortOrder: product.sortOrder,
          }}
        />
      </div>

      <ProductMediaManager
        productId={product.id}
        images={product.images.map((image) => ({
          id: image.id,
          url: image.media.url,
          alt: image.alt,
          width: image.media.width,
          height: image.media.height,
        }))}
      />

      <ProductVariantManager
        productId={product.id}
        basePrice={Number(product.basePrice)}
        variants={product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          size: variant.size,
          price: Number(variant.price),
          stock: variant.stock,
          isActive: variant.isActive,
        }))}
      />
    </div>
  );
}

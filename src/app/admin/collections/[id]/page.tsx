import { notFound } from 'next/navigation';

import { CollectionForm } from '@/components/admin/collection-form';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Edit Collection — Admin',
  path: '/admin/collections',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection) notFound();

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Collections</p>
      <h1 className="display mt-3 text-d3">{collection.title}</h1>
      <p className="mt-2 text-caption text-muted-foreground">/{collection.slug}</p>

      <div className="mt-10">
        <CollectionForm
          collectionId={collection.id}
          defaultValues={{
            title: collection.title,
            subtitle: collection.subtitle ?? '',
            season: collection.season ?? '',
            year: collection.year ?? undefined,
            description: collection.description ?? '',
            isPublished: collection.isPublished,
            sortOrder: collection.sortOrder,
          }}
        />
      </div>
    </div>
  );
}

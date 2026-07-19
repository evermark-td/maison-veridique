import { CollectionForm } from '@/components/admin/collection-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'New Collection — Admin',
  path: '/admin/collections/new',
  noIndex: true,
});

export default function NewCollectionPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Collections</p>
      <h1 className="display mt-3 text-d3">A new season.</h1>
      <div className="mt-10">
        <CollectionForm />
      </div>
    </div>
  );
}

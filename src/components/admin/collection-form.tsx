'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AdminField, adminInputClass } from '@/components/admin/admin-field';
import { createCollection, updateCollection } from '@/lib/actions/admin-collections';
import { cn } from '@/lib/utils';
import { collectionSchema, type CollectionInput } from '@/lib/validations/collection';

type CollectionFormProps = {
  /** Present in edit mode; absent when creating. */
  collectionId?: string;
  defaultValues?: Partial<CollectionInput>;
};

export function CollectionForm({ collectionId, defaultValues }: CollectionFormProps) {
  const router = useRouter();
  const isEdit = Boolean(collectionId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollectionInput>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      season: '',
      year: undefined,
      description: '',
      isPublished: false,
      sortOrder: 0,
      ...defaultValues,
    },
  });

  async function onSubmit(values: CollectionInput) {
    const result = isEdit
      ? await updateCollection(collectionId as string, values)
      : await createCollection(values);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? 'Collection saved.' : 'Collection created.');
    router.push('/admin/collections');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        <AdminField
          label="Title"
          htmlFor="title"
          error={errors.title?.message}
          required
          className="sm:col-span-2"
        >
          <input
            id="title"
            type="text"
            placeholder="e.g. The Quiet Hour"
            className={adminInputClass}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
        </AdminField>

        <AdminField
          label="Subtitle"
          htmlFor="subtitle"
          error={errors.subtitle?.message}
          className="sm:col-span-2"
        >
          <input
            id="subtitle"
            type="text"
            placeholder="A line under the title"
            className={adminInputClass}
            {...register('subtitle')}
          />
        </AdminField>

        <AdminField label="Season" htmlFor="season" error={errors.season?.message}>
          <input
            id="season"
            type="text"
            placeholder="Autumn–Winter"
            className={adminInputClass}
            {...register('season')}
          />
        </AdminField>

        <AdminField label="Year" htmlFor="year" error={errors.year?.message}>
          <input
            id="year"
            type="number"
            placeholder="2026"
            className={adminInputClass}
            aria-invalid={Boolean(errors.year)}
            {...register('year')}
          />
        </AdminField>

        <AdminField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="description"
            rows={4}
            placeholder="The story of the collection."
            className={cn(adminInputClass, 'resize-none')}
            {...register('description')}
          />
        </AdminField>

        <AdminField
          label="Sort order"
          htmlFor="sortOrder"
          error={errors.sortOrder?.message}
          hint="Lower numbers appear first."
        >
          <input
            id="sortOrder"
            type="number"
            className={adminInputClass}
            aria-invalid={Boolean(errors.sortOrder)}
            {...register('sortOrder')}
          />
        </AdminField>

        <div className="flex items-end pb-7">
          <label htmlFor="isPublished" className="flex cursor-pointer items-center gap-3 text-body">
            <input
              id="isPublished"
              type="checkbox"
              className="size-4 accent-foreground"
              {...register('isPublished')}
            />
            Published
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : isEdit ? 'Save collection' : 'Create collection'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/collections')}
          className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

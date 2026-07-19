'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AdminField, adminInputClass } from '@/components/admin/admin-field';
import { createProduct, updateProduct } from '@/lib/actions/admin-products';
import { cn } from '@/lib/utils';
import {
  productCurrencies,
  productSchema,
  type ProductInput,
} from '@/lib/validations/product';

export type CollectionOption = { id: string; title: string };

type ProductFormProps = {
  /** Present in edit mode; absent when creating. */
  productId?: string;
  collections: CollectionOption[];
  defaultValues?: Partial<ProductInput>;
};

export function ProductForm({ productId, collections, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      story: '',
      composition: '',
      careInstructions: '',
      basePrice: undefined,
      currency: 'EUR',
      collectionId: undefined,
      isFeatured: false,
      isPublished: false,
      sortOrder: 0,
      ...defaultValues,
    },
  });

  async function onSubmit(values: ProductInput) {
    const result = isEdit
      ? await updateProduct(productId as string, values)
      : await createProduct(values);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? 'Piece saved.' : 'Piece created.');
    router.push('/admin/products');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        <AdminField
          label="Name"
          htmlFor="name"
          error={errors.name?.message}
          required
          className="sm:col-span-2"
        >
          <input
            id="name"
            type="text"
            placeholder="e.g. The Longline Cashmere Coat"
            className={adminInputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
        </AdminField>

        <AdminField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          required
          className="sm:col-span-2"
        >
          <textarea
            id="description"
            rows={3}
            placeholder="What the client reads first."
            className={cn(adminInputClass, 'resize-none')}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'description-error' : undefined}
            {...register('description')}
          />
        </AdminField>

        <AdminField label="Base price" htmlFor="basePrice" error={errors.basePrice?.message} required>
          <input
            id="basePrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="2400"
            className={adminInputClass}
            aria-invalid={Boolean(errors.basePrice)}
            aria-describedby={errors.basePrice ? 'basePrice-error' : undefined}
            {...register('basePrice')}
          />
        </AdminField>

        <AdminField label="Currency" htmlFor="currency" error={errors.currency?.message}>
          <select id="currency" className={adminInputClass} {...register('currency')}>
            {productCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField
          label="Collection"
          htmlFor="collectionId"
          error={errors.collectionId?.message}
          hint={collections.length === 0 ? 'No collections yet — create one first.' : undefined}
          className="sm:col-span-2"
        >
          <select id="collectionId" className={adminInputClass} {...register('collectionId')}>
            <option value="">— No collection —</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.title}
              </option>
            ))}
          </select>
        </AdminField>

        <AdminField
          label="Story"
          htmlFor="story"
          error={errors.story?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="story"
            rows={3}
            placeholder="The longer editorial story of the piece."
            className={cn(adminInputClass, 'resize-none')}
            {...register('story')}
          />
        </AdminField>

        <AdminField label="Composition" htmlFor="composition" error={errors.composition?.message}>
          <input
            id="composition"
            type="text"
            placeholder="100% cashmere"
            className={adminInputClass}
            {...register('composition')}
          />
        </AdminField>

        <AdminField
          label="Care"
          htmlFor="careInstructions"
          error={errors.careInstructions?.message}
        >
          <input
            id="careInstructions"
            type="text"
            placeholder="Dry clean only; rest between wears"
            className={adminInputClass}
            {...register('careInstructions')}
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

        <div className="flex items-end gap-8 pb-7">
          <label htmlFor="isPublished" className="flex cursor-pointer items-center gap-3 text-body">
            <input
              id="isPublished"
              type="checkbox"
              className="size-4 accent-foreground"
              {...register('isPublished')}
            />
            Published
          </label>
          <label htmlFor="isFeatured" className="flex cursor-pointer items-center gap-3 text-body">
            <input
              id="isFeatured"
              type="checkbox"
              className="size-4 accent-foreground"
              {...register('isFeatured')}
            />
            Featured
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : isEdit ? 'Save piece' : 'Create piece'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

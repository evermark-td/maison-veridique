'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AdminField, adminInputClass } from '@/components/admin/admin-field';
import { createTestimonial, updateTestimonial } from '@/lib/actions/admin-content';
import { testimonialSchema, type TestimonialInput } from '@/lib/validations/testimonial';
import { cn } from '@/lib/utils';

export function TestimonialForm({
  testimonialId,
  defaultValues,
}: {
  testimonialId?: string;
  defaultValues?: Partial<TestimonialInput>;
}) {
  const router = useRouter();
  const isEdit = Boolean(testimonialId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { quoteText: '', authorName: '', authorTitle: '', sortOrder: 0, isPublished: true, ...defaultValues },
  });

  async function onSubmit(values: TestimonialInput) {
    const result = isEdit ? await updateTestimonial(testimonialId as string, values) : await createTestimonial(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? 'Testimonial saved.' : 'Testimonial added.');
    router.push('/admin/testimonials');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        <AdminField label="Quote" htmlFor="quoteText" error={errors.quoteText?.message} required className="sm:col-span-2">
          <textarea id="quoteText" rows={3} className={cn(adminInputClass, 'resize-none')} aria-invalid={Boolean(errors.quoteText)} {...register('quoteText')} />
        </AdminField>
        <AdminField label="Author" htmlFor="authorName" error={errors.authorName?.message} required>
          <input id="authorName" className={adminInputClass} aria-invalid={Boolean(errors.authorName)} {...register('authorName')} />
        </AdminField>
        <AdminField label="Author title / outlet" htmlFor="authorTitle" error={errors.authorTitle?.message}>
          <input id="authorTitle" placeholder="Fashion Director, Vogue" className={adminInputClass} {...register('authorTitle')} />
        </AdminField>
        <AdminField label="Sort order" htmlFor="sortOrder" error={errors.sortOrder?.message} hint="Lower numbers appear first.">
          <input id="sortOrder" type="number" className={adminInputClass} {...register('sortOrder')} />
        </AdminField>
        <label htmlFor="isPublished" className="flex cursor-pointer items-center gap-3 pb-7 text-body sm:items-end">
          <input id="isPublished" type="checkbox" className="size-4 accent-foreground" {...register('isPublished')} />
          Published
        </label>
      </div>
      <div className="mt-8 flex items-center gap-6">
        <button type="submit" disabled={isSubmitting} className="border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50">
          {isSubmitting ? 'Saving…' : isEdit ? 'Save' : 'Create'}
        </button>
        <button type="button" onClick={() => router.push('/admin/testimonials')} className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}

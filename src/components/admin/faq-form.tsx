'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AdminField, adminInputClass } from '@/components/admin/admin-field';
import { createFaq, updateFaq } from '@/lib/actions/admin-content';
import { faqSchema, type FaqInput } from '@/lib/validations/faq';
import { cn } from '@/lib/utils';

export function FaqForm({ faqId, defaultValues }: { faqId?: string; defaultValues?: Partial<FaqInput> }) {
  const router = useRouter();
  const isEdit = Boolean(faqId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FaqInput>({
    resolver: zodResolver(faqSchema),
    defaultValues: { question: '', answer: '', category: 'General', sortOrder: 0, isPublished: true, ...defaultValues },
  });

  async function onSubmit(values: FaqInput) {
    const result = isEdit ? await updateFaq(faqId as string, values) : await createFaq(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? 'Question saved.' : 'Question added.');
    router.push('/admin/faq');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        <AdminField label="Question" htmlFor="question" error={errors.question?.message} required className="sm:col-span-2">
          <input id="question" className={adminInputClass} aria-invalid={Boolean(errors.question)} {...register('question')} />
        </AdminField>
        <AdminField label="Answer" htmlFor="answer" error={errors.answer?.message} required className="sm:col-span-2">
          <textarea id="answer" rows={4} className={cn(adminInputClass, 'resize-none')} aria-invalid={Boolean(errors.answer)} {...register('answer')} />
        </AdminField>
        <AdminField label="Category" htmlFor="category" error={errors.category?.message} required>
          <input id="category" className={adminInputClass} aria-invalid={Boolean(errors.category)} {...register('category')} />
        </AdminField>
        <AdminField label="Sort order" htmlFor="sortOrder" error={errors.sortOrder?.message} hint="Lower numbers appear first.">
          <input id="sortOrder" type="number" className={adminInputClass} {...register('sortOrder')} />
        </AdminField>
        <label htmlFor="isPublished" className="flex cursor-pointer items-center gap-3 text-body">
          <input id="isPublished" type="checkbox" className="size-4 accent-foreground" {...register('isPublished')} />
          Published
        </label>
      </div>
      <FormButtons isEdit={isEdit} isSubmitting={isSubmitting} cancelHref="/admin/faq" onCancel={() => router.push('/admin/faq')} />
    </form>
  );
}

function FormButtons({ isEdit, isSubmitting, onCancel }: { isEdit: boolean; isSubmitting: boolean; cancelHref: string; onCancel: () => void }) {
  return (
    <div className="mt-8 flex items-center gap-6">
      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : isEdit ? 'Save' : 'Create'}
      </button>
      <button type="button" onClick={onCancel} className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground">
        Cancel
      </button>
    </div>
  );
}

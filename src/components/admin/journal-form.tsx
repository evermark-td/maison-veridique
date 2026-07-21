'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AdminField, adminInputClass } from '@/components/admin/admin-field';
import { createJournalPost, updateJournalPost } from '@/lib/actions/admin-journal';
import { journalSchema, type JournalInput } from '@/lib/validations/journal';
import { cn } from '@/lib/utils';

export function JournalForm({ postId, defaultValues }: { postId?: string; defaultValues?: Partial<JournalInput> }) {
  const router = useRouter();
  const isEdit = Boolean(postId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JournalInput>({
    resolver: zodResolver(journalSchema),
    defaultValues: { title: '', excerpt: '', content: '', tags: '', isPublished: false, ...defaultValues },
  });

  async function onSubmit(values: JournalInput) {
    const result = isEdit ? await updateJournalPost(postId as string, values) : await createJournalPost(values);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(isEdit ? 'Entry saved.' : 'Entry created.');
    router.push('/admin/journal');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-2xl">
      <div className="grid grid-cols-1 gap-x-10 gap-y-5">
        <AdminField label="Title" htmlFor="title" error={errors.title?.message} required>
          <input id="title" className={adminInputClass} aria-invalid={Boolean(errors.title)} {...register('title')} />
        </AdminField>
        <AdminField label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message} required hint="Shown on the journal index.">
          <textarea id="excerpt" rows={2} className={cn(adminInputClass, 'resize-none')} aria-invalid={Boolean(errors.excerpt)} {...register('excerpt')} />
        </AdminField>
        <AdminField label="Article" htmlFor="content" error={errors.content?.message} required hint="Plain text; blank lines separate paragraphs. Reading time is calculated automatically.">
          <textarea id="content" rows={12} className={cn(adminInputClass, 'resize-y')} aria-invalid={Boolean(errors.content)} {...register('content')} />
        </AdminField>
        <AdminField label="Tags" htmlFor="tags" error={errors.tags?.message} hint="Comma-separated, e.g. atelier, cashmere.">
          <input id="tags" className={adminInputClass} {...register('tags')} />
        </AdminField>
        <label htmlFor="isPublished" className="flex cursor-pointer items-center gap-3 text-body">
          <input id="isPublished" type="checkbox" className="size-4 accent-foreground" {...register('isPublished')} />
          Published
        </label>
      </div>
      <div className="mt-8 flex items-center gap-6">
        <button type="submit" disabled={isSubmitting} className="border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50">
          {isSubmitting ? 'Saving…' : isEdit ? 'Save' : 'Create'}
        </button>
        <button type="button" onClick={() => router.push('/admin/journal')} className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}

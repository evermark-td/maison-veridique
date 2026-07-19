'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { subscribeToNewsletter } from '@/lib/actions/newsletter';
import { newsletterSchema, type NewsletterInput } from '@/lib/validations/newsletter';

export function NewsletterForm() {
  // Explicit success state — RHF's `isSubmitSuccessful` only means the handler
  // didn't throw, so it would confirm a subscription that never persisted.
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: NewsletterInput) {
    const result = await subscribeToNewsletter(values);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    reset();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border-b border-paper/25 pb-3" role="status">
        <p className="text-body text-paper">Almost there.</p>
        <p className="mt-1 text-caption text-paper/55">
          Check your inbox to confirm your subscription.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-md">
      <div className="flex items-center gap-3 border-b border-paper/25 transition-colors duration-300 focus-within:border-paper">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          className="w-full bg-transparent py-3 text-body text-paper placeholder:text-paper/35 focus:outline-none"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'newsletter-error' : undefined}
          {...register('email')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Subscribe"
          className="group inline-flex size-10 shrink-0 items-center justify-center text-paper transition-opacity duration-300 hover:opacity-60 disabled:opacity-40"
        >
          <ArrowRight
            className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </button>
      </div>
      <p
        id="newsletter-error"
        role="alert"
        className={`mt-2 text-caption text-[#d99a9a] transition-opacity duration-300 ${
          errors.email ? 'opacity-100' : 'h-0 opacity-0'
        }`}
      >
        {errors.email?.message ?? ''}
      </p>
    </form>
  );
}

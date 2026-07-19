'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormField, fieldInputClass } from '@/components/forms/form-field';
import type { ContactContent } from '@/config/contact';
import { submitEnquiry } from '@/lib/actions/enquiry';
import { enquirySchema, type EnquiryInput } from '@/lib/validations/enquiry';
import { cn } from '@/lib/utils';

export function ContactForm({ enquiryTypes }: { enquiryTypes: ContactContent['enquiryTypes'] }) {
  // Explicit success state — NOT RHF's `isSubmitSuccessful`, which only means
  // "the handler didn't throw" and would show the thank-you screen even when
  // the server action failed to persist the enquiry.
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { fullName: '', email: '', phone: '', type: 'APPOINTMENT', message: '' },
  });

  async function onSubmit(values: EnquiryInput) {
    const result = await submitEnquiry(values);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setSent(true);
    toast.success('Your enquiry has been received. A client advisor will be in touch.');
  }

  if (sent) {
    return (
      <div className="flex min-h-80 flex-col justify-center border-t border-paper/15 py-12">
        <p className="label-micro text-paper/50">Thank you</p>
        <p className="display mt-4 text-d4 text-paper">Your enquiry is with us.</p>
        <p className="mt-4 max-w-md text-body text-paper/70">
          A client advisor will reply within one business day. For anything urgent, please call the
          Paris atelier directly.
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setSent(false);
          }}
          className="mt-8 w-fit border-b border-paper pb-1 text-micro font-medium tracking-[0.16em] uppercase text-paper transition-colors duration-300 hover:text-paper/70"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <FormField label="Full name" htmlFor="fullName" error={errors.fullName?.message} required>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={fieldInputClass}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            {...register('fullName')}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldInputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </FormField>

        <FormField label="Telephone" htmlFor="phone" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
            className={fieldInputClass}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
        </FormField>

        <FormField label="Enquiry" htmlFor="type" error={errors.type?.message} required>
          <div className="relative">
            <select
              id="type"
              className={cn(fieldInputClass, 'appearance-none pr-8')}
              aria-invalid={Boolean(errors.type)}
              aria-describedby={errors.type ? 'type-error' : undefined}
              {...register('type')}
            >
              {enquiryTypes.map((option) => (
                <option key={option.value} value={option.value} className="bg-noir text-paper">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-paper/50"
              strokeWidth={1.25}
              aria-hidden
            />
          </div>
        </FormField>
      </div>

      <FormField label="Message" htmlFor="message" error={errors.message?.message} required>
        <textarea
          id="message"
          rows={4}
          placeholder="How may the house help you?"
          className={cn(fieldInputClass, 'resize-none')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          {...register('message')}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-2 inline-flex w-fit items-center gap-3 border border-paper px-10 py-4 text-micro font-medium tracking-[0.16em] uppercase text-paper transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-paper hover:text-noir disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Send enquiry'}
        <ArrowRight
          className="size-4 transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5"
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
    </form>
  );
}

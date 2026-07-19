'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AuthField } from '@/components/forms/auth-field';
import { signInSchema, type SignInInput } from '@/lib/validations/auth';

/**
 * Reduces any redirect target to a same-origin path, defaulting to /account.
 * Rejects cross-origin URLs and protocol-relative (`//host`) values.
 */
function safeInternalPath(value: string | null): string {
  if (!value) return '/account';
  try {
    // Resolve relative or absolute against the current origin.
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return '/account';
    return `${url.pathname}${url.search}` || '/account';
  } catch {
    return '/account';
  }
}

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  // Resolve the post-login destination to a same-origin path only — never an
  // off-site URL (open-redirect). NextAuth's middleware passes an absolute
  // `callbackUrl`; our own links use a relative `next`.
  const nextPath = safeInternalPath(
    searchParams.get('callbackUrl') ?? searchParams.get('next'),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: SignInInput) {
    setFormError(null);

    const result = await signIn('credentials', {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    });

    if (!result || result.error) {
      setFormError('Those details did not match an account.');
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        error={errors.password?.message}
        {...register('password')}
      />

      {formError ? (
        <p role="alert" className="text-caption text-[#d99a9a]">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex h-12 w-full items-center justify-center border border-paper text-micro font-medium tracking-[0.16em] uppercase text-paper transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-paper hover:text-noir disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

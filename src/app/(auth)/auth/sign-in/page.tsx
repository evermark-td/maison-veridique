import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { SignInForm } from '@/components/auth/sign-in-form';
import { getCurrentUser } from '@/lib/auth';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sign In',
  path: '/auth/sign-in',
  noIndex: true,
});

export default async function SignInPage() {
  // Already signed in — showing the form again invites confusing
  // account-switching; send them to their account instead.
  const user = await getCurrentUser();
  if (user) redirect('/account');
  return (
    <div>
      <p className="label-micro text-paper/50">Client Account</p>
      <h1 className="display mt-4 text-d3 text-paper">Welcome back.</h1>
      <p className="mt-3 text-body text-paper/60">
        Sign in to view your orders, wishlist and appointments.
      </p>

      <div className="mt-10">
        {/* useSearchParams requires a Suspense boundary. */}
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>

      <p className="mt-8 text-caption text-paper/60">
        New to the house?{' '}
        <Link href="/auth/sign-up" className="text-paper underline underline-offset-4 hover:text-paper/70">
          Create an account
        </Link>
      </p>
    </div>
  );
}

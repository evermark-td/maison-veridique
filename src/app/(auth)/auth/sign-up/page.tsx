import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignUpForm } from '@/components/auth/sign-up-form';
import { getCurrentUser } from '@/lib/auth';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Create Account',
  path: '/auth/sign-up',
  noIndex: true,
});

export default async function SignUpPage() {
  // Already signed in — no reason to create another account from here.
  const user = await getCurrentUser();
  if (user) redirect('/account');
  return (
    <div>
      <p className="label-micro text-paper/50">Client Account</p>
      <h1 className="display mt-4 text-d3 text-paper">Join the house.</h1>
      <p className="mt-3 text-body text-paper/60">
        An account keeps your orders, wishlist and appointments in one place.
      </p>

      <div className="mt-10">
        <SignUpForm />
      </div>

      <p className="mt-8 text-caption text-paper/60">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="text-paper underline underline-offset-4 hover:text-paper/70">
          Sign in
        </Link>
      </p>
    </div>
  );
}

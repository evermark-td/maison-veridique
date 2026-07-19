import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { getCurrentUser } from '@/lib/auth';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'Account', path: '/account', noIndex: true });

const links = [
  { label: 'Orders', href: '/account/orders', description: 'Track and revisit past orders.' },
  { label: 'Wishlist', href: '/account/wishlist', description: 'Pieces you have saved.' },
  { label: 'Addresses', href: '/account/addresses', description: 'Manage delivery details.' },
];

export default async function AccountPage() {
  const user = await getCurrentUser();

  // Middleware already gates this route; this is a defensive fallback.
  if (!user) redirect('/auth/sign-in?next=/account');

  const isStaff = user.role === 'ADMIN' || user.role === 'EDITOR';

  return (
    <div className="container-page py-16 lg:py-24">
      <p className="label-micro">Account</p>
      <h1 className="display mt-4 text-d2">{user.name ? `Hello, ${user.name.split(' ')[0]}.` : 'Your account.'}</h1>
      <p className="mt-3 text-body text-muted-foreground">{user.email}</p>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col justify-between gap-8 bg-background p-8 transition-colors duration-300 hover:bg-bone/40"
          >
            <span className="display text-d4">{link.label}</span>
            <span className="text-caption text-muted-foreground">{link.description}</span>
          </Link>
        ))}
      </div>

      {isStaff ? (
        <div className="mt-8 border border-foreground p-6">
          <p className="label-micro">Staff</p>
          <p className="mt-2 text-body text-muted-foreground">
            You have {user.role.toLowerCase()} access.{' '}
            <Link href="/admin" className="text-foreground underline underline-offset-4">
              Open the dashboard
            </Link>
          </p>
        </div>
      ) : null}

      <div className="mt-12 border-t border-border pt-8">
        <SignOutButton />
      </div>
    </div>
  );
}

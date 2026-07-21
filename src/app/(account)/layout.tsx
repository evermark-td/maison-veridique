import { redirect } from 'next/navigation';

import { AccountNav } from '@/components/account/account-nav';
import { Footer } from '@/components/layout/footer';
import { SiteHeader } from '@/components/layout/site-header';
import { getCurrentUser } from '@/lib/auth';
import { getCartCount } from '@/lib/cart';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Middleware gates /account; this is defence-in-depth so the section can
  // never render for a signed-out request even if matcher config drifts.
  const [user, cartCount] = await Promise.all([getCurrentUser(), getCartCount()]);
  if (!user) redirect('/auth/sign-in?next=/account');

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader cartCount={cartCount} />
      <main id="main" className="flex-1 pt-[7.25rem] lg:pt-[8.25rem]">
        <div className="container-page py-16 lg:py-24">
          <p className="label-micro">Account</p>
          <h1 className="display mt-4 text-d2">
            {user.name ? `Hello, ${user.name.split(' ')[0]}.` : 'Your account.'}
          </h1>
          <p className="mt-3 text-body text-muted-foreground">{user.email}</p>

          <AccountNav />

          <div className="mt-12">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

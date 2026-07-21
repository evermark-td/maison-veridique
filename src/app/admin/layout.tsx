import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { getCurrentUser } from '@/lib/auth';
import { siteConfig } from '@/lib/seo';

const navLinks = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Enquiries', href: '/admin/enquiries' },
  { label: 'Collections', href: '/admin/collections' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Journal', href: '/admin/journal' },
  { label: 'FAQ', href: '/admin/faq' },
  { label: 'Testimonials', href: '/admin/testimonials' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already gates /admin; this is the defence-in-depth check so the
  // layout can never render for a non-staff session even if matcher config drifts.
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    redirect('/auth/sign-in?next=/admin');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="display text-base tracking-[0.28em] uppercase transition-opacity duration-300 hover:opacity-70"
            >
              {siteConfig.shortName}
            </Link>
            <span className="label-micro border-l border-border pl-8">Admin</span>
          </div>

          <nav aria-label="Admin" className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden className="h-4 w-px bg-border" />
            <SignOutButton />
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}

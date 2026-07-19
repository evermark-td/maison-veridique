import Link from 'next/link';

import { siteConfig } from '@/lib/seo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-noir text-paper">
      <header className="container-page flex h-20 items-center justify-center lg:h-24">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className="display text-lg tracking-[0.28em] uppercase transition-opacity duration-300 hover:opacity-70 lg:text-xl"
        >
          {siteConfig.shortName}
        </Link>
      </header>

      <main id="main" className="flex flex-1 items-start justify-center px-5 py-10 sm:items-center">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="container-page py-8 text-center">
        <p className="text-caption text-paper/40">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </footer>
    </div>
  );
}

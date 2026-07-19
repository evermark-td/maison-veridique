import Link from 'next/link';

import { BackToTop } from '@/components/layout/back-to-top';
import { NewsletterForm } from '@/components/layout/newsletter-form';
import { footerContent } from '@/config/footer';
import { siteConfig } from '@/lib/seo';

export function Footer() {
  const { newsletter, columns, social, legal } = footerContent;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-noir text-paper">
      <div className="container-page py-20 lg:py-28">
        {/* Newsletter band */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 border-b border-paper/15 pb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="display text-d3 text-paper">{newsletter.heading}</p>
            <p className="mt-4 max-w-md text-body text-paper/60">{newsletter.description}</p>
          </div>
          <div className="lg:col-span-6 lg:flex lg:justify-end">
            <NewsletterForm />
          </div>
        </div>

        {/* Wordmark + navigation */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label={`${siteConfig.name} — home`}
              className="display text-2xl tracking-[0.28em] uppercase transition-opacity duration-300 hover:opacity-70"
            >
              {siteConfig.shortName}
            </Link>
            <p className="mt-5 max-w-xs text-caption text-paper/50">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-8">
            {columns.map((column) => (
              <div key={column.heading}>
                <p className="label-micro text-paper/45">{column.heading}</p>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex text-body text-paper/75 transition-colors duration-300 hover:text-paper"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-paper transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-6 border-t border-paper/15 pt-8 lg:mt-24 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-caption text-paper/45">
              © {year} {siteConfig.name}. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-5">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-caption text-paper/45 transition-colors duration-300 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-x-6">
            <ul className="flex gap-x-5">
              {social.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-micro font-medium tracking-[0.16em] uppercase text-paper/60 transition-colors duration-300 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <span aria-hidden className="hidden h-4 w-px bg-paper/20 lg:block" />
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}

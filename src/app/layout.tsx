import type { Metadata, Viewport } from 'next';

import { fontDisplay, fontSans } from '@/lib/fonts';
import { buildMetadata, siteConfig } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers';
import '@/styles/globals.css';

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: '#FAF9F7',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Font variables live on <html> so `:root` can resolve --font-display / --font-sans.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontSans.variable, fontDisplay.variable)}
    >
      <body className="min-h-dvh antialiased">
        {/* No-JS fallback: reveals default to hidden; force them visible if the
            class-toggling script never runs. */}
        <noscript>
          <style>{`.reveal-item{opacity:1!important;transform:none!important}.reveal-line{transform:none!important;opacity:1!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { siteConfig, buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Page not found',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="container-page flex items-center justify-between pt-10 lg:pt-14">
        <Link href="/" className="label-micro tracking-[0.28em] text-foreground">
          {siteConfig.shortName}
        </Link>
        <span className="label-micro">Error 404</span>
      </header>

      <div className="container-page flex flex-1 flex-col justify-center py-20">
        <div className="max-w-3xl">
          <h1 className="display text-d1">
            This page has
            <br />
            slipped past us.
          </h1>
          <p className="mt-10 max-w-xl text-lead text-muted-foreground">
            The address you followed no longer leads anywhere on the house. Take a wander through
            the current collection — or write to us if you were expecting to find something
            particular.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
            <Button asChild>
              <Link href="/">Return home</Link>
            </Button>
            <Button variant="link" asChild>
              <Link href="/collections">Discover the collections</Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="container-page flex flex-wrap items-center justify-between gap-4 pb-10">
        <span className="label-micro">{siteConfig.name}</span>
        <span className="label-micro">Paris · Milano · Tokyo</span>
      </footer>
    </main>
  );
}

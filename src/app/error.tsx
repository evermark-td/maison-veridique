'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/seo';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Digest is the only identifier surfaced to the client for server errors.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="container-page flex items-center justify-between pt-10 lg:pt-14">
        <Link href="/" className="label-micro tracking-[0.28em] text-foreground">
          {siteConfig.shortName}
        </Link>
        <span className="label-micro">Unexpected pause</span>
      </header>

      <div className="container-page flex flex-1 flex-col justify-center py-20">
        <div className="max-w-3xl">
          <h1 className="display text-d1">
            The house has
            <br />
            paused a moment.
          </h1>
          <p className="mt-10 max-w-xl text-lead text-muted-foreground">
            An unexpected error interrupted your visit. Please try again — if the pause continues,
            our client services team is a message away.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
            <Button onClick={reset}>Try again</Button>
            <Button variant="link" asChild>
              <Link href="/">Return home</Link>
            </Button>
          </div>

          {error.digest ? (
            <p className="mt-14 label-micro text-muted-foreground">Reference · {error.digest}</p>
          ) : null}
        </div>
      </div>

      <footer className="container-page flex flex-wrap items-center justify-between gap-4 pb-10">
        <span className="label-micro">{siteConfig.name}</span>
        <span className="label-micro">Paris · Milano · Tokyo</span>
      </footer>
    </main>
  );
}

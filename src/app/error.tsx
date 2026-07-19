'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container-page flex min-h-dvh flex-col items-start justify-center gap-6">
      <p className="label-micro">Error</p>
      <h1 className="display text-d3">Something did not go to plan.</h1>
      <p className="max-w-(--container-measure) text-muted-foreground">
        The page could not be rendered. Please try again, or return to the home page.
      </p>
      <button
        onClick={reset}
        className="border-b border-foreground pb-1 text-micro font-medium uppercase tracking-[0.16em]"
      >
        Try again
      </button>
    </main>
  );
}

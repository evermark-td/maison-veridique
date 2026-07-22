'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';
import { Toaster } from 'sonner';

import { NewsletterStatusToast } from '@/components/layout/newsletter-status-toast';
import { QueryProvider } from '@/providers/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        {/* Suspense keeps useSearchParams from de-opting pages to client render. */}
        <Suspense fallback={null}>
          <NewsletterStatusToast />
        </Suspense>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: 'rounded-none border border-border bg-background text-foreground',
              title: 'text-caption font-medium',
              description: 'text-caption text-muted-foreground',
            },
          }}
        />
      </QueryProvider>
    </SessionProvider>
  );
}

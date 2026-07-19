'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

import { QueryProvider } from '@/providers/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
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

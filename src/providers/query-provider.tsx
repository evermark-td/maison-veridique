'use client';

import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Devtools are loaded dynamically in dev only. The dynamic import + NODE_ENV
// guard together guarantee the ~250 KB devtools chunk is dropped from the
// production bundle (belt-and-braces — even if tree-shaking misses it).
const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
        { ssr: false },
      )
    : () => null;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}

'use client';

import { usePathname } from 'next/navigation';

import { isOverlayRoute } from '@/config/layout';
import { cn } from '@/lib/utils';

/**
 * On overlay routes the hero sits beneath the transparent navbar, so no top
 * offset is applied. Every other route is pushed clear of the fixed header.
 */
export function SiteMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlay = isOverlayRoute(pathname);

  return (
    <main id="main" className={cn('flex-1', !overlay && 'pt-[7.25rem] lg:pt-[8.25rem]')}>
      {children}
    </main>
  );
}

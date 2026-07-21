'use client';

import { usePathname } from 'next/navigation';

import { Navbar } from '@/components/layout/navbar';
import { isOverlayRoute } from '@/config/layout';

export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();

  return <Navbar transparent={isOverlayRoute(pathname)} cartCount={cartCount} />;
}

'use client';

import { usePathname } from 'next/navigation';

import { Navbar } from '@/components/layout/navbar';
import { isOverlayRoute } from '@/config/layout';

export function SiteHeader() {
  const pathname = usePathname();

  return <Navbar transparent={isOverlayRoute(pathname)} />;
}

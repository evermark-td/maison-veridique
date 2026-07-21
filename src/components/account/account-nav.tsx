'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Overview', href: '/account' },
  { label: 'Orders', href: '/account/orders' },
  { label: 'Wishlist', href: '/account/wishlist' },
  { label: 'Addresses', href: '/account/addresses' },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-b border-border pb-4">
      {tabs.map((tab) => {
        const active =
          tab.href === '/account' ? pathname === '/account' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300',
              active ? 'text-foreground' : 'text-foreground/60 hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

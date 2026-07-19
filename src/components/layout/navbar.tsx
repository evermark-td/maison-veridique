'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { MegaMenu } from '@/components/layout/mega-menu';
import { MobileNav } from '@/components/layout/mobile-nav';
import { mainNav } from '@/config/navigation';
import { useScrollState } from '@/hooks/use-scroll-state';
import { siteConfig } from '@/lib/seo';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_CLOSE_DELAY = 120;

type NavbarProps = {
  /** Overlays the navbar on a full-bleed hero until the user scrolls. */
  transparent?: boolean;
  /** Item count shown on the bag — wired to the cart in Phase 4. */
  cartCount?: number;
};

export function Navbar({ transparent = false, cartCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const { condensed, hidden, atTop } = useScrollState({
    enabled: !activeMenu && !mobileOpen,
  });

  const isOverlay = transparent && atTop && !activeMenu;

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const openMenu = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveMenu(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveMenu(null), HOVER_CLOSE_DELAY);
  };

  const activeItem = mainNav.find((item) => item.label === activeMenu && item.columns?.length);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setActiveMenu(null);
        }}
        className={cn(
          'fixed inset-x-0 top-0 z-80 transition-colors duration-500 [transition-timing-function:var(--ease-luxe)]',
          // Scrolled state is a solid, opaque bar — no backdrop-filter. A fixed
          // backdrop-blur layer over scrolling content is a known Chromium source
          // of stale-snapshot ghosting and white flashes; a solid bar is bulletproof.
          isOverlay
            ? 'bg-transparent text-paper'
            : 'border-b border-border bg-background text-foreground',
        )}
      >
        <div className={cn('transition-opacity duration-500', condensed && 'hidden')}>
          <AnnouncementBar />
        </div>

        <nav
          aria-label="Primary"
          onMouseLeave={scheduleClose}
          className="relative"
        >
          <div
            className={cn(
              'container-page grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 [transition-timing-function:var(--ease-luxe)]',
              condensed ? 'h-16' : 'h-20 lg:h-24',
            )}
          >
            {/* Left — desktop links / mobile trigger */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="-ml-3 inline-flex size-11 items-center justify-center lg:hidden"
              >
                <Menu className="size-5" strokeWidth={1.25} />
              </button>

              <ul className="hidden items-center gap-8 lg:flex">
                {mainNav.map((item) => {
                  const isActive =
                    activeMenu === item.label ||
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <li
                      key={item.label}
                      onMouseEnter={() =>
                        item.columns?.length ? openMenu(item.label) : setActiveMenu(null)
                      }
                    >
                      <Link
                        href={item.href}
                        onFocus={() =>
                          item.columns?.length ? openMenu(item.label) : setActiveMenu(null)
                        }
                        aria-expanded={item.columns?.length ? activeMenu === item.label : undefined}
                        className="group relative inline-block py-2 text-micro font-medium uppercase tracking-[0.16em]"
                      >
                        {item.label}
                        <span
                          className={cn(
                            'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500 [transition-timing-function:var(--ease-luxe)]',
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Centre — wordmark */}
            <Link
              href="/"
              aria-label={`${siteConfig.name} — home`}
              className="display px-4 text-center text-lg leading-none tracking-[0.28em] whitespace-nowrap uppercase transition-opacity duration-300 hover:opacity-70 sm:text-xl lg:text-2xl"
            >
              {siteConfig.shortName}
            </Link>

            {/* Right — actions */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              <Link
                href="/search"
                aria-label="Search"
                className="inline-flex size-11 items-center justify-center transition-opacity duration-300 hover:opacity-60"
              >
                <Search className="size-[18px]" strokeWidth={1.25} />
              </Link>

              <Link
                href="/account/wishlist"
                aria-label="Wishlist"
                className="hidden size-11 items-center justify-center transition-opacity duration-300 hover:opacity-60 sm:inline-flex"
              >
                <Heart className="size-[18px]" strokeWidth={1.25} />
              </Link>

              <Link
                href="/account"
                aria-label="Account"
                className="hidden size-11 items-center justify-center transition-opacity duration-300 hover:opacity-60 sm:inline-flex"
              >
                <User className="size-[18px]" strokeWidth={1.25} />
              </Link>

              <Link
                href="/cart"
                aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                className="relative -mr-3 inline-flex size-11 items-center justify-center transition-opacity duration-300 hover:opacity-60"
              >
                <ShoppingBag className="size-[18px]" strokeWidth={1.25} />
                {cartCount > 0 ? (
                  <span className="absolute right-1.5 top-2 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] leading-4 font-medium text-accent-foreground">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {activeItem ? (
              <MegaMenu
                key={activeItem.label}
                item={activeItem}
                onNavigate={() => setActiveMenu(null)}
              />
            ) : null}
          </AnimatePresence>
        </nav>
      </motion.header>

      {/* Veil behind the open mega menu */}
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => setActiveMenu(null)}
            className="fixed inset-0 z-70 hidden bg-ink/25 lg:block"
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}

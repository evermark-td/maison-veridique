'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { mainNav, utilityNav } from '@/config/navigation';
import { siteConfig } from '@/lib/seo';

const EASE = [0.16, 1, 0.3, 1] as const;

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const close = () => onOpenChange(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="fixed inset-0 z-90 bg-ink/40 backdrop-blur-xs lg:hidden"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild aria-describedby={undefined}>
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="fixed inset-y-0 right-0 z-100 flex h-dvh w-full max-w-sm flex-col bg-background lg:hidden"
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>

                <div className="flex h-16 items-center justify-between border-b border-border px-5">
                  <Link href="/" onClick={close} className="display text-lg tracking-[0.2em]">
                    {siteConfig.shortName}
                  </Link>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="-mr-2 inline-flex size-11 items-center justify-center text-foreground"
                  >
                    <X className="size-5" strokeWidth={1.25} />
                  </Dialog.Close>
                </div>

                <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
                  <ul className="space-y-1">
                    {mainNav.map((item, index) => {
                      const isOpen = expanded === item.label;
                      const hasChildren = Boolean(item.columns?.length);

                      return (
                        <motion.li
                          key={item.label}
                          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: EASE,
                            delay: reduceMotion ? 0 : 0.15 + index * 0.05,
                          }}
                          className="border-b border-border"
                        >
                          <div className="flex items-center justify-between">
                            <Link
                              href={item.href}
                              onClick={close}
                              className="display flex-1 py-4 text-d4"
                            >
                              {item.label}
                            </Link>

                            {hasChildren ? (
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                                onClick={() => setExpanded(isOpen ? null : item.label)}
                                className="inline-flex size-11 items-center justify-center text-muted-foreground"
                              >
                                {isOpen ? (
                                  <Minus className="size-4" strokeWidth={1.25} />
                                ) : (
                                  <Plus className="size-4" strokeWidth={1.25} />
                                )}
                              </button>
                            ) : null}
                          </div>

                          <AnimatePresence initial={false}>
                            {hasChildren && isOpen ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.45, ease: EASE }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-6 pb-6">
                                  {item.columns?.map((column) => (
                                    <div key={column.heading}>
                                      <p className="label-micro">{column.heading}</p>
                                      <ul className="mt-3 space-y-2.5">
                                        {column.links.map((link) => (
                                          <li key={link.href + link.label}>
                                            <Link
                                              href={link.href}
                                              onClick={close}
                                              className="block text-body text-foreground/75"
                                            >
                                              {link.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <ul className="mt-10 space-y-3">
                    {utilityNav.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={close}
                          className="label-micro block hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

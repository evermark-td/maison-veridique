'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import type { NavItem } from '@/config/navigation';

const EASE = [0.16, 1, 0.3, 1] as const;

type MegaMenuProps = {
  item: NavItem;
  onNavigate: () => void;
};

export function MegaMenu({ item, onNavigate }: MegaMenuProps) {
  const reduceMotion = useReducedMotion();

  if (!item.columns?.length) return null;

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute inset-x-0 top-full hidden border-b border-border bg-background lg:block"
    >
      <div className="container-page grid grid-cols-12 gap-10 py-14">
        <div className="col-span-8 grid grid-cols-3 gap-10">
          {item.columns.map((column, columnIndex) => (
            <div key={column.heading}>
              <p className="label-micro">{column.heading}</p>
              <ul className="mt-6 space-y-3.5">
                {column.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.href + link.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: reduceMotion ? 0 : 0.08 + columnIndex * 0.04 + linkIndex * 0.035,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      className="group inline-flex items-baseline text-body text-foreground/80 transition-colors duration-300 hover:text-foreground"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {item.feature ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: reduceMotion ? 0 : 0.1 }}
            className="col-span-4"
          >
            <Link href={item.feature.href} onClick={onNavigate} className="group block">
              <div className="relative aspect-4/5 w-full overflow-hidden bg-bone">
                <Image
                  src={item.feature.imageSrc}
                  alt={item.feature.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] [transition-timing-function:var(--ease-luxe)] group-hover:scale-105"
                />
              </div>
              <p className="label-micro mt-5">{item.feature.eyebrow}</p>
              <p className="display mt-2 text-d4">{item.feature.title}</p>
            </Link>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { announcements } from '@/config/navigation';

const ROTATE_MS = 5000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || announcements.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % announcements.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative z-50 bg-ink text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-page flex h-9 items-center justify-center overflow-hidden">
        <p aria-live="polite" className="relative h-4 w-full text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={index}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 block text-micro font-medium uppercase tracking-[0.16em] text-paper/80"
            >
              {announcements[index]}
            </motion.span>
          </AnimatePresence>
        </p>
      </div>
    </div>
  );
}

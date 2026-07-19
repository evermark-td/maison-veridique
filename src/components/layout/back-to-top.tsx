'use client';

import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
      className="group inline-flex items-center gap-2 text-micro font-medium tracking-[0.16em] uppercase text-paper/60 transition-colors duration-300 hover:text-paper"
    >
      <ArrowUp
        className="size-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:-translate-y-1"
        strokeWidth={1.5}
        aria-hidden
      />
      Back to top
    </button>
  );
}

import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { ParallaxImage } from '@/components/motion/parallax-image';
import type { ServiceEntry } from '@/config/services';

type ServiceCardProps = {
  service: ServiceEntry;
  delay?: number;
};

export function ServiceCard({ service, delay = 0 }: ServiceCardProps) {
  const { index, title, description, href, image } = service;

  return (
    <FadeIn as="li" delay={delay}>
      <Link href={href} className="group block">
        <div className="relative overflow-hidden">
          <ParallaxImage
            src={image.src}
            alt={image.alt}
            sizes="(min-width: 1024px) 44vw, (min-width: 640px) 90vw, 100vw"
            ratioClassName="aspect-4/5"
          />
          {/* Index marker — deterministic paper-on-scrim (no mix-blend-mode,
              which forces a backdrop repaint on every scroll frame). */}
          <span className="pointer-events-none absolute left-4 top-4 z-10 inline-flex h-8 min-w-8 items-center justify-center bg-noir/55 px-2 text-micro font-medium uppercase tracking-[0.16em] text-paper">
            {index}
          </span>
        </div>

        <div className="mt-6 flex items-start justify-between gap-6 border-t border-border pt-6">
          <div>
            <h3 className="display text-d4">{title}</h3>
            <p className="mt-3 max-w-sm text-body text-muted-foreground">{description}</p>
          </div>
          <span
            aria-hidden
            className="mt-1.5 shrink-0 text-lg leading-none transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5"
          >
            →
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}

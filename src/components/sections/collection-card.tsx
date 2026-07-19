import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { ParallaxImage } from '@/components/motion/parallax-image';
import type { CollectionEntry } from '@/config/collections';
import { cn } from '@/lib/utils';

type CollectionCardProps = {
  collection: CollectionEntry;
  sizes: string;
  /** Vertical offset for the staggered editorial grid. */
  offset?: boolean;
  delay?: number;
};

export function CollectionCard({ collection, sizes, offset = false, delay = 0 }: CollectionCardProps) {
  const { slug, season, year, title, description, pieceCount, image } = collection;
  const href = `/collections/${slug}`;

  return (
    <FadeIn as="li" delay={delay} className={cn(offset && 'lg:mt-24')}>
      <Link href={href} className="group block">
        <ParallaxImage
          src={image.src}
          alt={image.alt}
          sizes={sizes}
          ratioClassName="aspect-4/5"
        />

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <p className="label-micro">
            {season} <span className="text-foreground/40">·</span> {year}
          </p>
          <p className="label-micro">{pieceCount} pieces</p>
        </div>

        <h3 className="display mt-3 text-d4">
          <span className="relative inline-block">
            {title}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
          </span>
        </h3>
        <p className="mt-2 max-w-sm text-body text-muted-foreground">{description}</p>
      </Link>
    </FadeIn>
  );
}

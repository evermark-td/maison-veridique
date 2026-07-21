import Image from 'next/image';
import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

export type PortfolioCollection = {
  slug: string;
  title: string;
  season: string | null;
  year: number | null;
  description: string | null;
  pieceCount: number;
  /** Lead image of the collection's first published piece; null until media exists. */
  image: { src: string; alt: string; blurDataURL?: string } | null;
};

type CollectionCardProps = {
  collection: PortfolioCollection;
  sizes: string;
  /** Vertical offset for the staggered editorial grid. */
  offset?: boolean;
  delay?: number;
};

export function CollectionCard({ collection, sizes, offset = false, delay = 0 }: CollectionCardProps) {
  const { slug, season, year, title, description, pieceCount, image } = collection;

  return (
    <FadeIn as="li" delay={delay} className={cn(offset && 'lg:mt-24')}>
      <Link href={`/collections/${slug}`} className="group block">
        <div className="relative aspect-4/5 overflow-hidden bg-bone">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-luxe)] group-hover:scale-[1.03]"
              {...(image.blurDataURL
                ? { placeholder: 'blur' as const, blurDataURL: image.blurDataURL }
                : {})}
            />
          ) : (
            <span className="absolute bottom-5 left-5 label-micro">{season ?? 'The House'}</span>
          )}
        </div>

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <p className="label-micro">
            {season ?? 'The House'}
            {year ? (
              <>
                {' '}
                <span aria-hidden className="text-foreground/40">·</span> {year}
              </>
            ) : null}
          </p>
          <p className="label-micro">
            {pieceCount} {pieceCount === 1 ? 'piece' : 'pieces'}
          </p>
        </div>

        <h3 className="display mt-3 text-d4">
          <span className="relative inline-block">
            {title}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
          </span>
        </h3>
        {description ? (
          <p className="mt-2 max-w-sm text-body text-muted-foreground">{description}</p>
        ) : null}
      </Link>
    </FadeIn>
  );
}

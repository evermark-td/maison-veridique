import Image from 'next/image';

import { getBlur } from '@/config/image-blur';
import { cn } from '@/lib/utils';

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Aspect ratio utility, e.g. "aspect-4/5". */
  ratioClassName?: string;
  priority?: boolean;
};

/**
 * Editorial image in a strictly-clipped, fixed-ratio frame.
 *
 * The image sits still. It intentionally does NOT drift on scroll: continuous
 * scroll-linked transforms promote a GPU layer per image, and with a dozen of
 * them updating every scroll frame, some GPUs leave stale-tile "ghost" copies
 * during scroll. A static, `overflow-hidden` frame renders identically on every
 * device. Reveal-on-scroll is handled by the surrounding <FadeIn> wrapper.
 *
 * A base64 blur placeholder is applied so the frame never shows as an empty
 * block while the image lazy-loads.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  ratioClassName = 'aspect-4/5',
  priority = false,
}: ParallaxImageProps) {
  const blurDataURL = getBlur(src);

  return (
    <div className={cn('relative overflow-hidden bg-bone', ratioClassName, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        {...(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})}
      />
    </div>
  );
}

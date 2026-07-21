'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { toggleWishlist } from '@/lib/actions/wishlist';
import { cn, formatPrice } from '@/lib/utils';

export type WishlistProduct = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: { url: string; alt: string; blurDataURL?: string } | null;
};

export function WishlistItemCard({ product }: { product: WishlistProduct }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      const result = await toggleWishlist(product.productId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <li className={cn('group', pending && 'pointer-events-none opacity-50')}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden bg-bone">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-luxe)] group-hover:scale-[1.03]"
              {...(product.image.blurDataURL
                ? { placeholder: 'blur' as const, blurDataURL: product.image.blurDataURL }
                : {})}
            />
          ) : null}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h2 className="display text-d4">{product.name}</h2>
          <p className="shrink-0 text-body font-medium tabular-nums">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={remove}
        className="mt-2 text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-destructive"
      >
        Remove
      </button>
    </li>
  );
}

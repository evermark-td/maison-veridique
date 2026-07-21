'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { removeCartItem, setCartItemQuantity } from '@/lib/actions/cart';
import { cn, formatPrice } from '@/lib/utils';

export type CartLine = {
  id: string;
  productSlug: string;
  productName: string;
  colorName: string;
  size: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  stock: number;
  image: { url: string; alt: string; blurDataURL?: string } | null;
};

export function CartLineItem({ line }: { line: CartLine }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setQuantity(quantity: number) {
    startTransition(async () => {
      const result = await setCartItemQuantity({ cartItemId: line.id, quantity });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await removeCartItem(line.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  const atMax = line.quantity >= line.stock;

  return (
    <li
      className={cn(
        'grid grid-cols-[5rem_1fr] gap-x-5 gap-y-4 border-b border-border py-8 sm:grid-cols-[6rem_1fr_auto]',
        pending && 'pointer-events-none opacity-50',
      )}
    >
      <Link href={`/products/${line.productSlug}`} className="relative aspect-4/5 overflow-hidden bg-bone">
        {line.image ? (
          <Image
            src={line.image.url}
            alt={line.image.alt}
            fill
            sizes="6rem"
            className="object-cover"
            {...(line.image.blurDataURL
              ? { placeholder: 'blur' as const, blurDataURL: line.image.blurDataURL }
              : {})}
          />
        ) : null}
      </Link>

      <div className="min-w-0">
        <Link
          href={`/products/${line.productSlug}`}
          className="display text-d4 transition-colors duration-300 hover:text-accent"
        >
          {line.productName}
        </Link>
        <p className="mt-1 label-micro normal-case tracking-[0.16em]">
          {line.colorName} · {line.size}
        </p>

        {/* Quantity stepper */}
        <div className="mt-4 inline-flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity(line.quantity - 1)}
            aria-label="Decrease quantity"
            className="inline-flex size-9 items-center justify-center text-foreground/70 transition-colors duration-300 hover:text-foreground"
          >
            <Minus className="size-3.5" strokeWidth={1.5} />
          </button>
          <span className="min-w-8 text-center text-body tabular-nums">{line.quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(line.quantity + 1)}
            disabled={atMax}
            aria-label="Increase quantity"
            className="inline-flex size-9 items-center justify-center text-foreground/70 transition-colors duration-300 hover:text-foreground disabled:opacity-30"
          >
            <Plus className="size-3.5" strokeWidth={1.5} />
          </button>
        </div>
        {atMax ? (
          <p className="mt-2 text-caption text-muted-foreground">All {line.stock} in stock are in your bag.</p>
        ) : null}
      </div>

      <div className="col-span-2 flex items-start justify-between sm:col-span-1 sm:flex-col sm:items-end sm:justify-between">
        <p className="text-body font-medium tabular-nums">
          {formatPrice(line.unitPrice * line.quantity, line.currency)}
        </p>
        <button
          type="button"
          onClick={remove}
          className="inline-flex items-center gap-1.5 text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground"
        >
          <X className="size-3.5" strokeWidth={1.5} />
          Remove
        </button>
      </div>
    </li>
  );
}

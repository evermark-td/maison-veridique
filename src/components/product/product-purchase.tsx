'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { addToCart } from '@/lib/actions/cart';
import { cn } from '@/lib/utils';

export type PurchaseVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  size: string;
  stock: number;
};

export function ProductPurchase({ variants }: { variants: PurchaseVariant[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Colours in first-seen order.
  const colours = useMemo(() => {
    const map = new Map<string, { name: string; hex: string; sizes: PurchaseVariant[] }>();
    for (const variant of variants) {
      const key = `${variant.colorName}|${variant.colorHex}`;
      const entry = map.get(key);
      if (entry) entry.sizes.push(variant);
      else map.set(key, { name: variant.colorName, hex: variant.colorHex, sizes: [variant] });
    }
    return [...map.values()];
  }, [variants]);

  const [colourKey, setColourKey] = useState(() => {
    const firstWithStock = colours.find((c) => c.sizes.some((s) => s.stock > 0)) ?? colours[0];
    return firstWithStock ? `${firstWithStock.name}|${firstWithStock.hex}` : '';
  });
  const [variantId, setVariantId] = useState<string | null>(null);

  const activeColour = colours.find((c) => `${c.name}|${c.hex}` === colourKey) ?? colours[0];

  function selectColour(key: string) {
    setColourKey(key);
    setVariantId(null); // size choice doesn't carry across colours
  }

  function add() {
    if (!variantId) {
      toast.error('Choose a size.');
      return;
    }
    startTransition(async () => {
      const result = await addToCart({ variantId, quantity: 1 });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success('Added to your bag.');
      router.refresh(); // refresh the navbar count
    });
  }

  if (variants.length === 0) return null;

  return (
    <div className="mt-10 border-t border-border pt-8">
      {/* Colour */}
      {colours.length > 1 ? (
        <fieldset>
          <legend className="label-micro">
            Colour — <span className="text-foreground">{activeColour?.name}</span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {colours.map((colour) => {
              const key = `${colour.name}|${colour.hex}`;
              const selected = key === colourKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectColour(key)}
                  aria-pressed={selected}
                  aria-label={colour.name}
                  className={cn(
                    'size-8 rounded-full border p-0.5 transition-colors duration-300',
                    selected ? 'border-foreground' : 'border-border hover:border-foreground/40',
                  )}
                >
                  <span
                    aria-hidden
                    className="block size-full rounded-full"
                    style={{ backgroundColor: colour.hex }}
                  />
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Size */}
      <fieldset className="mt-8">
        <legend className="label-micro">Size</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {activeColour?.sizes.map((variant) => {
            const soldOut = variant.stock <= 0;
            const selected = variant.id === variantId;
            return (
              <button
                key={variant.id}
                type="button"
                disabled={soldOut}
                onClick={() => setVariantId(variant.id)}
                aria-pressed={selected}
                className={cn(
                  'min-w-12 border px-4 py-2 text-caption transition-colors duration-300',
                  soldOut
                    ? 'cursor-not-allowed border-border/60 text-muted-foreground line-through'
                    : selected
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground hover:border-foreground',
                )}
                title={soldOut ? 'Sold out' : undefined}
              >
                {variant.size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={add}
        disabled={pending}
        className="mt-10 inline-flex w-full items-center justify-center gap-3 border border-foreground px-10 py-4 text-micro font-medium uppercase tracking-[0.16em] transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
      >
        {pending ? 'Adding…' : 'Add to bag'}
      </button>
    </div>
  );
}

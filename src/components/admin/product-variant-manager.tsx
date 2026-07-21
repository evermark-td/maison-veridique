'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { adminInputClass } from '@/components/admin/admin-field';
import {
  createVariant,
  deleteVariant,
  toggleVariantActive,
  updateVariantStock,
} from '@/lib/actions/admin-variants';
import { cn } from '@/lib/utils';

export type VariantItem = {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: string;
  price: number;
  stock: number;
  isActive: boolean;
};

const cellAction =
  'border-b border-foreground/50 pb-0.5 text-micro font-medium tracking-[0.16em] uppercase text-foreground/70 transition-colors duration-300 hover:border-foreground hover:text-foreground';

export function ProductVariantManager({
  productId,
  basePrice,
  variants,
}: {
  productId: string;
  basePrice: number;
  variants: VariantItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function addVariant(formData: FormData) {
    const input = {
      sku: formData.get('sku'),
      colorName: formData.get('colorName'),
      colorHex: formData.get('colorHex'),
      size: formData.get('size'),
      price: formData.get('price'),
      stock: formData.get('stock'),
    };
    startTransition(async () => {
      const result = await createVariant(productId, input);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success('Variant added.');
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <section aria-label="Product variants" className="mt-14 max-w-3xl border-t border-border pt-10">
      <p className="label-micro">Variants</p>
      <p className="mt-2 text-caption text-muted-foreground">
        Each colour and size is one sellable variant with its own SKU and stock. A piece with no
        active, in-stock variant reads as “Enquire” on the storefront.
      </p>

      {variants.length > 0 ? (
        <ul className="mt-8">
          {variants.map((variant) => (
            <VariantRow key={variant.id} variant={variant} pending={pending} />
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-body text-muted-foreground">No variants yet.</p>
      )}

      {/* Add-variant form */}
      <form
        ref={formRef}
        action={addVariant}
        className={cn('mt-10 border-t border-border pt-8', pending && 'pointer-events-none opacity-50')}
      >
        <p className="label-micro">Add a variant</p>
        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-6">
          <label className="col-span-2 sm:col-span-2">
            <span className="label-micro">SKU</span>
            <input name="sku" required placeholder="VER-COAT-CH-M" className={adminInputClass} />
          </label>
          <label className="col-span-2 sm:col-span-2">
            <span className="label-micro">Colour</span>
            <input name="colorName" required placeholder="Charcoal" className={adminInputClass} />
          </label>
          <label>
            <span className="label-micro">Hex</span>
            <input name="colorHex" required defaultValue="#1A1A1A" className={adminInputClass} />
          </label>
          <label>
            <span className="label-micro">Size</span>
            <input name="size" required placeholder="M" className={adminInputClass} />
          </label>
          <label>
            <span className="label-micro">Price</span>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={basePrice}
              className={adminInputClass}
            />
          </label>
          <label>
            <span className="label-micro">Stock</span>
            <input name="stock" type="number" min="0" required defaultValue="0" className={adminInputClass} />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-6 border border-foreground px-8 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-50"
        >
          {pending ? 'Working…' : 'Add variant'}
        </button>
      </form>
    </section>
  );
}

function VariantRow({ variant, pending }: { variant: VariantItem; pending: boolean }) {
  const router = useRouter();
  const [rowPending, startRow] = useTransition();
  const [stock, setStock] = useState(String(variant.stock));
  const busy = pending || rowPending;

  function saveStock() {
    if (stock === String(variant.stock)) return;
    startRow(async () => {
      const result = await updateVariantStock(variant.id, stock);
      if (!result.ok) {
        toast.error(result.error);
        setStock(String(variant.stock));
        return;
      }
      router.refresh();
    });
  }

  function toggleActive() {
    startRow(async () => {
      const result = await toggleVariantActive(variant.id);
      if (!result.ok) toast.error(result.error);
      else router.refresh();
    });
  }

  function remove() {
    startRow(async () => {
      const result = await deleteVariant(variant.id);
      if (!result.ok) toast.error(result.error);
      else router.refresh();
    });
  }

  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border py-4',
        !variant.isActive && 'opacity-50',
        busy && 'pointer-events-none opacity-40',
      )}
    >
      <span
        aria-hidden
        className="size-5 shrink-0 rounded-full border border-border"
        style={{ backgroundColor: variant.colorHex }}
      />
      <span className="min-w-28 text-body">
        {variant.colorName} · {variant.size}
      </span>
      <span className="min-w-32 text-caption text-muted-foreground">{variant.sku}</span>

      <label className="flex items-center gap-2">
        <span className="label-micro">Stock</span>
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          onBlur={saveStock}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
          className="w-16 border-b border-border bg-transparent py-1 text-body focus:border-foreground focus:outline-none"
        />
      </label>

      <span
        className={cn(
          'text-micro font-medium tracking-[0.16em] uppercase',
          variant.stock === 0 ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        {variant.stock === 0 ? 'Sold out' : variant.isActive ? 'Live' : 'Hidden'}
      </span>

      <div className="ml-auto flex items-center gap-5">
        <button type="button" onClick={toggleActive} className={cellAction}>
          {variant.isActive ? 'Hide' : 'Show'}
        </button>
        <button
          type="button"
          onClick={remove}
          aria-label="Delete variant"
          className="text-foreground/60 transition-colors duration-300 hover:text-destructive"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </li>
  );
}

import { cn } from '@/lib/utils';

type Variant = {
  id: string;
  colorName: string;
  colorHex: string;
  size: string;
  stock: number;
};

/**
 * Read-only availability for the PDP: colours the piece is cut in, and the
 * sizes held for each — sold-out sizes shown but struck. Interactive selection
 * arrives with the cart; until then the page is enquiry-led.
 */
export function ProductAvailability({ variants }: { variants: Variant[] }) {
  if (variants.length === 0) return null;

  // Group by colour, preserving first-seen order.
  const colours = new Map<string, { name: string; hex: string; sizes: Variant[] }>();
  for (const variant of variants) {
    const key = `${variant.colorName}|${variant.colorHex}`;
    const entry = colours.get(key);
    if (entry) entry.sizes.push(variant);
    else colours.set(key, { name: variant.colorName, hex: variant.colorHex, sizes: [variant] });
  }

  const anyInStock = variants.some((variant) => variant.stock > 0);

  return (
    <div className="mt-10 border-t border-border pt-8">
      <div className="flex items-baseline justify-between">
        <p className="label-micro">Cut in</p>
        <p className="label-micro">
          {anyInStock ? 'Available to order' : 'By enquiry'}
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {[...colours.values()].map((colour) => (
          <div key={`${colour.name}-${colour.hex}`}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="size-5 rounded-full border border-border"
                style={{ backgroundColor: colour.hex }}
              />
              <span className="text-body text-foreground">{colour.name}</span>
            </div>

            <ul className="mt-3 flex flex-wrap gap-2 pl-8">
              {colour.sizes.map((variant) => (
                <li
                  key={variant.id}
                  className={cn(
                    'inline-flex min-w-11 items-center justify-center border px-3 py-1.5 text-caption',
                    variant.stock > 0
                      ? 'border-border text-foreground'
                      : 'border-border/60 text-muted-foreground line-through',
                  )}
                  title={variant.stock > 0 ? 'In stock' : 'Sold out'}
                >
                  {variant.size}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';

import { CartLineItem, type CartLine } from '@/components/shop/cart-line-item';
import { getCartForRead } from '@/lib/cart';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Your Bag', path: '/cart', noIndex: true });

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cart = await getCartForRead();
  const items = cart?.items ?? [];

  const lines: CartLine[] = items.map((item) => {
    const product = item.variant.product;
    const image = product.images[0];
    return {
      id: item.id,
      productSlug: product.slug,
      productName: product.name,
      colorName: item.variant.colorName,
      size: item.variant.size,
      unitPrice: Number(item.variant.price),
      currency: product.currency,
      quantity: item.quantity,
      stock: item.variant.stock,
      image: image
        ? {
            url: image.media.url,
            alt: image.alt,
            blurDataURL: image.media.blurDataUrl ?? undefined,
          }
        : null,
    };
  });

  const currency = lines[0]?.currency ?? 'EUR';
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  return (
    <div className="container-page py-16 lg:py-24">
      <p className="label-micro">Your bag</p>
      <h1 className="display mt-3 text-d2">
        {lines.length === 0 ? 'Your bag is empty.' : 'Your bag.'}
      </h1>

      {lines.length === 0 ? (
        <div className="mt-8 max-w-md">
          <p className="text-lead text-muted-foreground">
            Nothing here yet. Explore the current collection to begin.
          </p>
          <Link
            href="/collections"
            className="group mt-8 inline-flex items-center gap-3 text-micro font-medium tracking-[0.16em] uppercase"
          >
            <span className="relative">
              View the collections
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
            </span>
            <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
          {/* Lines */}
          <ul className="lg:col-span-7">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>

          {/* Summary */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-foreground pt-6 lg:sticky lg:top-32">
              <p className="label-micro">Summary</p>

              <dl className="mt-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <dt className="text-body text-muted-foreground">Subtotal</dt>
                  <dd className="text-body font-medium tabular-nums">
                    {formatPrice(subtotal, currency)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-body text-muted-foreground">Shipping</dt>
                  <dd className="text-caption text-muted-foreground">Calculated at checkout</dd>
                </div>
              </dl>

              <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
                <p className="text-body">Total</p>
                <p className="display text-d4 tabular-nums">{formatPrice(subtotal, currency)}</p>
              </div>

              <Link
                href="/checkout"
                className="mt-8 flex items-center justify-center gap-3 bg-foreground px-10 py-4 text-micro font-medium tracking-[0.16em] uppercase text-background transition-colors duration-500 [transition-timing-function:var(--ease-luxe)] hover:bg-accent"
              >
                Proceed to checkout
              </Link>

              <Link
                href="/collections"
                className="mt-4 block text-center text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground"
              >
                Continue shopping
              </Link>

              <p className="mt-6 text-caption text-muted-foreground">
                Insured, duty-paid delivery. Complimentary above €1,000.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

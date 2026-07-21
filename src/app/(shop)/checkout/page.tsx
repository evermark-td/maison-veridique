import { redirect } from 'next/navigation';

import { CheckoutForm } from '@/components/shop/checkout-form';
import { getCurrentUser } from '@/lib/auth';
import { getCartForRead } from '@/lib/cart';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Checkout', path: '/checkout', noIndex: true });

export const dynamic = 'force-dynamic';

const FREE_SHIPPING_THRESHOLD = 1000;
const FLAT_SHIPPING = 25;

export default async function CheckoutPage() {
  const [cart, user] = await Promise.all([getCartForRead(), getCurrentUser()]);
  const items = cart?.items ?? [];

  // No empty checkout — send an empty bag back to the cart.
  if (items.length === 0) redirect('/cart');

  const currency = items[0]!.variant.product.currency;
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0,
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  return (
    <div className="container-page py-16 lg:py-24">
      <p className="label-micro">Checkout</p>
      <h1 className="display mt-3 text-d2">Delivery &amp; order.</h1>

      <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <CheckoutForm defaultEmail={user?.email ?? ''} defaultName={user?.name ?? ''} />
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border-t border-foreground pt-6 lg:sticky lg:top-32">
            <p className="label-micro">Your order</p>

            <ul className="mt-6 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-body">{item.variant.product.name}</p>
                    <p className="label-micro normal-case tracking-[0.16em]">
                      {item.variant.colorName} · {item.variant.size} · ×{item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-body tabular-nums">
                    {formatPrice(Number(item.variant.price) * item.quantity, currency)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-border pt-6">
              <div className="flex items-baseline justify-between">
                <dt className="text-body text-muted-foreground">Subtotal</dt>
                <dd className="text-body tabular-nums">{formatPrice(subtotal, currency)}</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-body text-muted-foreground">Shipping</dt>
                <dd className="text-body tabular-nums">
                  {shipping === 0 ? 'Complimentary' : formatPrice(shipping, currency)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
              <p className="text-body">Total</p>
              <p className="display text-d4 tabular-nums">{formatPrice(total, currency)}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

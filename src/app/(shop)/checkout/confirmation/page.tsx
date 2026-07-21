import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { FadeIn } from '@/components/motion/fade-in';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Order Confirmed', path: '/checkout/confirmation', noIndex: true });

export const dynamic = 'force-dynamic';

export default async function ConfirmationPage() {
  const cookieStore = await cookies();
  const orderId = cookieStore.get('last_order')?.value;
  if (!orderId) redirect('/collections');

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, shippingAddress: true },
  });

  // The cookie is set only on a successful order the caller just placed; if a
  // signed-in user owns it, that's fine too. Anything else falls through.
  if (!order) redirect('/collections');
  const user = await getCurrentUser();
  const permitted = order.userId === null || order.userId === user?.id || !user;
  if (!permitted) redirect('/account');

  const { currency } = order;

  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <FadeIn immediate y={0}>
          <p className="label-micro">Thank you</p>
          <h1 className="display mt-4 text-d2">Your order is with the house.</h1>
          <p className="mt-6 text-lead text-muted-foreground">
            Order <span className="text-foreground">{order.orderNumber}</span> is confirmed. A
            client advisor will be in touch within one business day to arrange payment and
            delivery. A copy has been noted against {order.email}.
          </p>
        </FadeIn>

        <FadeIn immediate delay={0.15}>
          <ul className="mt-12 border-t border-border">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-6 border-b border-border py-5">
                <div>
                  <p className="text-body">{item.nameSnapshot}</p>
                  <p className="label-micro normal-case tracking-[0.16em]">
                    {item.skuSnapshot} · ×{item.quantity}
                  </p>
                </div>
                <p className="text-body font-medium tabular-nums">
                  {formatPrice(Number(item.priceSnapshot) * item.quantity, currency)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3">
            <div className="flex items-baseline justify-between">
              <dt className="text-body text-muted-foreground">Subtotal</dt>
              <dd className="text-body tabular-nums">{formatPrice(Number(order.subtotal), currency)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-body text-muted-foreground">Shipping</dt>
              <dd className="text-body tabular-nums">
                {Number(order.shipping) === 0 ? 'Complimentary' : formatPrice(Number(order.shipping), currency)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-border pt-4">
              <dt className="text-body">Total</dt>
              <dd className="display text-d4 tabular-nums">{formatPrice(Number(order.total), currency)}</dd>
            </div>
          </dl>

          {order.shippingAddress ? (
            <div className="mt-10 border-t border-border pt-8">
              <p className="label-micro">Delivery to</p>
              <address className="mt-3 text-body text-foreground/80 not-italic">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? (
                  <>
                    <br />
                    {order.shippingAddress.line2}
                  </>
                ) : null}
                <br />
                {order.shippingAddress.city}
                {order.shippingAddress.region ? `, ${order.shippingAddress.region}` : ''}{' '}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </address>
            </div>
          ) : null}

          <Link
            href="/collections"
            className="group mt-12 inline-flex items-center gap-3 text-micro font-medium tracking-[0.16em] uppercase"
          >
            <span className="relative">
              Continue exploring
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
            </span>
            <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}

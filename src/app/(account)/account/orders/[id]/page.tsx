import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDate, formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Order', path: '/account/orders', noIndex: true });

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-bone text-foreground',
  PAID: 'bg-foreground text-background',
  SHIPPED: 'bg-foreground text-background',
  DELIVERED: 'border border-border text-muted-foreground',
  CANCELLED: 'border border-border text-muted-foreground line-through',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  });

  // Scope to the owner — a signed-in user must never read another's order by id.
  if (!order || order.userId !== user!.id) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/account/orders"
        className="label-micro transition-colors duration-300 hover:text-foreground"
      >
        ← All orders
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <h2 className="display text-d3">{order.orderNumber}</h2>
        <span
          className={cn(
            'inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase',
            STATUS_STYLES[order.status],
          )}
        >
          {order.status}
        </span>
      </div>
      <p className="mt-2 text-caption text-muted-foreground">Placed {formatDate(order.placedAt)}</p>

      {order.status === 'PENDING' ? (
        <p className="mt-6 max-w-md border border-border p-5 text-body text-muted-foreground">
          A client advisor will confirm payment and delivery within one business day.
        </p>
      ) : null}

      <ul className="mt-10 border-t border-border">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-baseline justify-between gap-6 border-b border-border py-5">
            <div>
              <p className="text-body">{item.nameSnapshot}</p>
              <p className="label-micro normal-case tracking-[0.16em]">
                {item.skuSnapshot} · ×{item.quantity}
              </p>
            </div>
            <p className="text-body font-medium tabular-nums">
              {formatPrice(Number(item.priceSnapshot) * item.quantity, order.currency)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3">
        <div className="flex items-baseline justify-between">
          <dt className="text-body text-muted-foreground">Subtotal</dt>
          <dd className="text-body tabular-nums">{formatPrice(Number(order.subtotal), order.currency)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-body text-muted-foreground">Shipping</dt>
          <dd className="text-body tabular-nums">
            {Number(order.shipping) === 0 ? 'Complimentary' : formatPrice(Number(order.shipping), order.currency)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-4">
          <dt className="text-body">Total</dt>
          <dd className="display text-d4 tabular-nums">{formatPrice(Number(order.total), order.currency)}</dd>
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
    </div>
  );
}

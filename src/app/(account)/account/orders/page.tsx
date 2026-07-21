import Link from 'next/link';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDate, formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Orders', path: '/account/orders', noIndex: true });

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-bone text-foreground',
  PAID: 'bg-foreground text-background',
  SHIPPED: 'bg-foreground text-background',
  DELIVERED: 'border border-border text-muted-foreground',
  CANCELLED: 'border border-border text-muted-foreground line-through',
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  const orders = await prisma.order.findMany({
    where: { userId: user!.id },
    orderBy: { placedAt: 'desc' },
    include: { _count: { select: { items: true } } },
  });

  if (orders.length === 0) {
    return (
      <div className="max-w-md">
        <p className="text-body text-muted-foreground">
          No orders yet. When you place one, it will appear here with its status and details.
        </p>
        <Link
          href="/collections"
          className="group mt-6 inline-flex items-center gap-3 text-micro font-medium tracking-[0.16em] uppercase"
        >
          <span className="relative">
            View the collections
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
          </span>
          <span aria-hidden className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
    );
  }

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/account/orders/${order.id}`}
            className="grid grid-cols-1 gap-x-8 gap-y-3 border-b border-border py-6 transition-colors duration-300 hover:bg-bone/30 sm:grid-cols-12 sm:items-center"
          >
            <div className="sm:col-span-3">
              <span
                className={cn(
                  'inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase',
                  STATUS_STYLES[order.status],
                )}
              >
                {order.status}
              </span>
            </div>
            <div className="sm:col-span-5">
              <p className="text-body">{order.orderNumber}</p>
              <p className="text-caption text-muted-foreground">
                {formatDate(order.placedAt)} · {order._count.items}{' '}
                {order._count.items === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
            <p className="text-body font-medium tabular-nums sm:col-span-4 sm:justify-self-end">
              {formatPrice(Number(order.total), order.currency)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

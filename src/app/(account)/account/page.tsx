import Link from 'next/link';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDate, formatPrice } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Account', path: '/account', noIndex: true });

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-bone text-foreground',
  PAID: 'bg-foreground text-background',
  SHIPPED: 'bg-foreground text-background',
  DELIVERED: 'border border-border text-muted-foreground',
  CANCELLED: 'border border-border text-muted-foreground line-through',
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'EDITOR';

  const [recentOrder, wishlistCount, addressCount] = await Promise.all([
    prisma.order.findFirst({
      where: { userId: user!.id },
      orderBy: { placedAt: 'desc' },
      select: { orderNumber: true, placedAt: true, status: true, total: true, currency: true },
    }),
    prisma.wishlistItem.count({ where: { userId: user!.id } }),
    prisma.address.count({ where: { userId: user!.id } }),
  ]);

  return (
    <div className="max-w-3xl">
      <p className="text-lead text-muted-foreground">
        Your orders, saved pieces and delivery details — all in one place.
      </p>

      {/* Most recent order */}
      <section className="mt-12 border-t border-border pt-8">
        <div className="flex items-baseline justify-between">
          <p className="label-micro">Most recent order</p>
          <Link
            href="/account/orders"
            className="text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground"
          >
            All orders
          </Link>
        </div>

        {recentOrder ? (
          <Link
            href="/account/orders"
            className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-border p-6 transition-colors duration-300 hover:bg-bone/40"
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  'inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase',
                  STATUS_STYLES[recentOrder.status],
                )}
              >
                {recentOrder.status}
              </span>
              <div>
                <p className="text-body">{recentOrder.orderNumber}</p>
                <p className="text-caption text-muted-foreground">
                  {formatDate(recentOrder.placedAt)}
                </p>
              </div>
            </div>
            <p className="text-body font-medium tabular-nums">
              {formatPrice(Number(recentOrder.total), recentOrder.currency)}
            </p>
          </Link>
        ) : (
          <p className="mt-5 text-body text-muted-foreground">No orders yet.</p>
        )}
      </section>

      {/* Quick links */}
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border">
        <Link href="/account/wishlist" className="bg-background p-6 transition-colors duration-300 hover:bg-bone/40">
          <span className="display text-d4">{wishlistCount}</span>
          <span className="mt-1 block label-micro">Saved {wishlistCount === 1 ? 'piece' : 'pieces'}</span>
        </Link>
        <Link href="/account/addresses" className="bg-background p-6 transition-colors duration-300 hover:bg-bone/40">
          <span className="display text-d4">{addressCount}</span>
          <span className="mt-1 block label-micro">Saved {addressCount === 1 ? 'address' : 'addresses'}</span>
        </Link>
      </div>

      {isStaff ? (
        <div className="mt-10 border border-foreground p-6">
          <p className="label-micro">Staff</p>
          <p className="mt-2 text-body text-muted-foreground">
            You have {user?.role.toLowerCase()} access.{' '}
            <Link href="/admin" className="text-foreground underline underline-offset-4">
              Open the dashboard
            </Link>
          </p>
        </div>
      ) : null}

      <div className="mt-12 border-t border-border pt-8">
        <SignOutButton />
      </div>
    </div>
  );
}

import { randomBytes } from 'node:crypto';

import { cookies } from 'next/headers';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const CART_COOKIE = 'cart_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Shared shape for reading a cart with everything the UI needs. */
export const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true,
              currency: true,
              images: {
                orderBy: { sortOrder: 'asc' },
                take: 1,
                select: { alt: true, media: { select: { url: true, blurDataUrl: true } } },
              },
            },
          },
        },
      },
    },
  },
} as const;

export type CartWithItems = NonNullable<Awaited<ReturnType<typeof getCartForRead>>>;

/**
 * Reads the current request's cart WITHOUT mutating cookies — safe to call
 * during a Server Component render. Returns null when no cart exists yet.
 */
export async function getCartForRead() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(CART_COOKIE)?.value;

  if (!user && !sessionToken) return null;

  return prisma.cart.findFirst({
    where: user ? { userId: user.id } : { sessionToken },
    include: cartInclude,
  });
}

/** Lightweight item count for the navbar badge. */
export async function getCartCount(): Promise<number> {
  const cart = await getCartForRead();
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Gets or creates the cart for the current request. Sets the guest cookie when
 * one is created — only call from a Server Action or Route Handler, where
 * cookie writes are permitted.
 */
export async function getOrCreateCart() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();

  if (user) {
    const existing = await prisma.cart.findFirst({ where: { userId: user.id } });
    return existing ?? prisma.cart.create({ data: { userId: user.id } });
  }

  const token = cookieStore.get(CART_COOKIE)?.value;
  if (token) {
    const existing = await prisma.cart.findUnique({ where: { sessionToken: token } });
    if (existing) return existing;
  }

  const newToken = randomBytes(24).toString('hex');
  const cart = await prisma.cart.create({ data: { sessionToken: newToken } });
  cookieStore.set(CART_COOKIE, newToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return cart;
}

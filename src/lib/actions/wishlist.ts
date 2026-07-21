'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type WishlistResult =
  | { ok: true; saved: boolean }
  | { ok: false; error: string };

/**
 * Toggles a product in the signed-in user's wishlist. Returns the resulting
 * saved state so the button can reflect it without a full reload.
 */
export async function toggleWishlist(productId: unknown): Promise<WishlistResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'Please sign in to save pieces.' };
  if (!z.string().cuid().safeParse(productId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  const id = productId as string;
  try {
    const product = await prisma.product.findFirst({
      where: { id, isPublished: true },
      select: { id: true },
    });
    if (!product) return { ok: false, error: 'This piece is not available.' };

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId: id } },
      select: { id: true },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      revalidatePath('/account/wishlist');
      revalidatePath('/account');
      return { ok: true, saved: false };
    }

    await prisma.wishlistItem.create({ data: { userId: user.id, productId: id } });
    revalidatePath('/account/wishlist');
    revalidatePath('/account');
    return { ok: true, saved: true };
  } catch (error) {
    console.error('[toggleWishlist] failed', error);
    return { ok: false, error: 'Could not update your wishlist.' };
  }
}

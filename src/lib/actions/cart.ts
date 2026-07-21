'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getOrCreateCart } from '@/lib/cart';
import { prisma } from '@/lib/prisma';

export type ActionResult = { ok: true } | { ok: false; error: string };

const addSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
});

function revalidateCartSurfaces() {
  revalidatePath('/cart');
  // The navbar badge is rendered from the layout on every marketing route.
  revalidatePath('/', 'layout');
}

/**
 * Adds a variant to the cart, or increments it if already present. The total
 * quantity is always re-validated against live stock — never trust a stale
 * client view of availability.
 */
export async function addToCart(input: unknown): Promise<ActionResult> {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid request.' };

  const { variantId, quantity } = parsed.data;

  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { id: true, isActive: true, stock: true, product: { select: { isPublished: true } } },
    });

    if (!variant || !variant.isActive || !variant.product.isPublished) {
      return { ok: false, error: 'This piece is no longer available.' };
    }
    if (variant.stock <= 0) {
      return { ok: false, error: 'This size is sold out.' };
    }

    const cart = await getOrCreateCart();
    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
      select: { quantity: true },
    });

    const desired = (existingItem?.quantity ?? 0) + quantity;
    if (desired > variant.stock) {
      return {
        ok: false,
        error:
          existingItem
            ? `Only ${variant.stock} in stock — already in your bag.`
            : `Only ${variant.stock} in stock.`,
      };
    }

    await prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
      update: { quantity: desired },
      create: { cartId: cart.id, variantId, quantity },
    });

    revalidateCartSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[addToCart] failed', error);
    return { ok: false, error: 'Could not add to your bag.' };
  }
}

const quantitySchema = z.object({
  cartItemId: z.string().cuid(),
  quantity: z.coerce.number().int().min(0).max(20),
});

/**
 * Sets a line quantity. Zero removes the line. Any value is capped at live
 * stock so a cart can never exceed what the house actually holds.
 */
export async function setCartItemQuantity(input: unknown): Promise<ActionResult> {
  const parsed = quantitySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Invalid request.' };

  const { cartItemId, quantity } = parsed.data;

  try {
    // Scope the mutation to the current request's cart — a user must not be able
    // to edit a line in someone else's cart by guessing an id.
    const cart = await getOrCreateCart();
    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
      select: { id: true, variant: { select: { stock: true } } },
    });
    if (!item) return { ok: false, error: 'That item is not in your bag.' };

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
      revalidateCartSurfaces();
      return { ok: true };
    }

    if (quantity > item.variant.stock) {
      return { ok: false, error: `Only ${item.variant.stock} in stock.` };
    }

    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    revalidateCartSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[setCartItemQuantity] failed', error);
    return { ok: false, error: 'Could not update your bag.' };
  }
}

export async function removeCartItem(cartItemId: unknown): Promise<ActionResult> {
  if (!z.string().cuid().safeParse(cartItemId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  try {
    const cart = await getOrCreateCart();
    // deleteMany scoped to this cart — no-op (not an error) if it isn't ours.
    await prisma.cartItem.deleteMany({ where: { id: cartItemId as string, cartId: cart.id } });
    revalidateCartSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[removeCartItem] failed', error);
    return { ok: false, error: 'Could not update your bag.' };
  }
}

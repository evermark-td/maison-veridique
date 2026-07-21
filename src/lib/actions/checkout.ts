'use server';

import { randomBytes } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { getCurrentUser } from '@/lib/auth';
import { getCartForRead } from '@/lib/cart';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validations/checkout';

export type ActionResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

const LAST_ORDER_COOKIE = 'last_order';
const FREE_SHIPPING_THRESHOLD = 1000;
const FLAT_SHIPPING = 25;

function newOrderNumber() {
  // 8 base36 chars — human-readable, ample entropy for a boutique catalogue.
  return `VER-${randomBytes(6).toString('hex').toUpperCase().slice(0, 8)}`;
}

/** Thrown inside the transaction when a line can no longer be fulfilled. */
class StockError extends Error {}

/**
 * Places an order from the current cart. Prices, names and stock are all taken
 * from the database inside a transaction — never from the client — and each
 * variant is decremented with a conditional update so two simultaneous
 * checkouts can never oversell the same stock.
 */
export async function placeOrder(input: unknown): Promise<ActionResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Please check the delivery details.' };
  }

  const user = await getCurrentUser();
  const cart = await getCartForRead();
  const items = cart?.items ?? [];
  if (items.length === 0) return { ok: false, error: 'Your bag is empty.' };

  const address = parsed.data;
  const currency = items[0]!.variant.product.currency;

  try {
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: {
        variantId: string;
        nameSnapshot: string;
        skuSnapshot: string;
        priceSnapshot: number;
        quantity: number;
      }[] = [];

      for (const item of items) {
        // Atomic guard: decrement only if enough stock remains right now.
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count !== 1) {
          throw new StockError(
            `${item.variant.product.name} (${item.variant.colorName} · ${item.variant.size}) is no longer available in that quantity.`,
          );
        }

        const price = Number(item.variant.price);
        subtotal += price * item.quantity;
        orderItemsData.push({
          variantId: item.variantId,
          nameSnapshot: `${item.variant.product.name} — ${item.variant.colorName} · ${item.variant.size}`,
          skuSnapshot: item.variant.sku,
          priceSnapshot: price,
          quantity: item.quantity,
        });
      }

      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
      const total = subtotal + shipping;

      const shippingAddress = await tx.address.create({
        data: {
          // Order-scoped: this address belongs to the order, not the user's
          // address book (which the account page manages separately). The order
          // keeps its delivery record even if the user edits their book.
          userId: null,
          fullName: address.fullName,
          line1: address.line1,
          line2: address.line2 || null,
          city: address.city,
          region: address.region || null,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone || null,
        },
      });

      const created = await tx.order.create({
        data: {
          orderNumber: newOrderNumber(),
          userId: user?.id ?? null,
          email: address.email.toLowerCase(),
          status: 'PENDING',
          subtotal,
          shipping,
          tax: 0,
          total,
          currency,
          shippingAddressId: shippingAddress.id,
          billingAddressId: shippingAddress.id,
          items: { create: orderItemsData },
        },
      });

      // Empty the cart — its lines are now the order.
      await tx.cartItem.deleteMany({ where: { cartId: cart!.id } });

      return created;
    });

    // Gate the confirmation page to the person who just ordered.
    const cookieStore = await cookies();
    cookieStore.set(LAST_ORDER_COOKIE, order.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // one hour
    });

    revalidatePath('/cart');
    revalidatePath('/', 'layout');

    return { ok: true, orderNumber: order.orderNumber };
  } catch (error) {
    if (error instanceof StockError) {
      return { ok: false, error: error.message };
    }
    console.error('[placeOrder] failed', error);
    return { ok: false, error: 'We could not place your order. Please try again.' };
  }
}

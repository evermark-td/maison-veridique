'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addressSchema } from '@/lib/validations/address';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function addAddress(input: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'Please sign in.' };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the address.' };

  const data = parsed.data;
  try {
    await prisma.address.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        line1: data.line1,
        line2: data.line2 || null,
        city: data.city,
        region: data.region || null,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone || null,
      },
    });
    revalidatePath('/account/addresses');
    revalidatePath('/account');
    return { ok: true };
  } catch (error) {
    console.error('[addAddress] failed', error);
    return { ok: false, error: 'Could not save the address.' };
  }
}

export async function deleteAddress(addressId: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'Please sign in.' };
  if (!z.string().cuid().safeParse(addressId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  const id = addressId as string;
  try {
    // Owner scope — a user can only delete their own book entries.
    const address = await prisma.address.findFirst({
      where: { id, userId: user.id },
      select: { id: true },
    });
    if (!address) return { ok: false, error: 'Address not found.' };

    // Guard: never delete an address an order still references — that would
    // erase the order's delivery record.
    const referenced = await prisma.order.count({
      where: { OR: [{ shippingAddressId: id }, { billingAddressId: id }] },
    });
    if (referenced > 0) {
      return { ok: false, error: 'This address is on an order and cannot be removed.' };
    }

    await prisma.address.delete({ where: { id } });
    revalidatePath('/account/addresses');
    revalidatePath('/account');
    return { ok: true };
  } catch (error) {
    console.error('[deleteAddress] failed', error);
    return { ok: false, error: 'Could not remove the address.' };
  }
}

'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stockSchema, variantSchema } from '@/lib/validations/variant';

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireStaffAction() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) return null;
  return user;
}

async function revalidateForProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true, collection: { select: { slug: true } } },
  });
  if (product) {
    revalidatePath(`/products/${product.slug}`);
    if (product.collection) revalidatePath(`/collections/${product.collection.slug}`);
  }
  revalidatePath('/admin/products');
}

function friendlyConstraintError(error: unknown): string | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    const target = String(error.meta?.target ?? '');
    if (target.includes('sku')) return 'That SKU is already in use.';
    return 'That colour and size already exist for this piece.';
  }
  return null;
}

export async function createVariant(productId: string, input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(productId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the variant details.' };

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) return { ok: false, error: 'Piece not found.' };

    const variant = await prisma.productVariant.create({
      data: { productId, ...parsed.data },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'variant.create',
        entity: 'ProductVariant',
        entityId: variant.id,
        diffJson: { sku: variant.sku, colorName: variant.colorName, size: variant.size },
      },
    });

    await revalidateForProduct(productId);
    return { ok: true };
  } catch (error) {
    const friendly = friendlyConstraintError(error);
    if (friendly) return { ok: false, error: friendly };
    console.error('[createVariant] failed', error);
    return { ok: false, error: 'Could not add the variant.' };
  }
}

export async function updateVariantStock(variantId: string, stock: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(variantId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  const parsedStock = stockSchema.safeParse(stock);
  if (!parsedStock.success) return { ok: false, error: 'Enter a whole number of items.' };

  try {
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: parsedStock.data },
      select: { productId: true, sku: true },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'variant.stock',
        entity: 'ProductVariant',
        entityId: variantId,
        diffJson: { sku: variant.sku, stock: parsedStock.data },
      },
    });

    await revalidateForProduct(variant.productId);
    return { ok: true };
  } catch (error) {
    console.error('[updateVariantStock] failed', error);
    return { ok: false, error: 'Could not update stock.' };
  }
}

export async function toggleVariantActive(variantId: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(variantId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  try {
    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { isActive: true, sku: true, productId: true },
    });
    if (!existing) return { ok: false, error: 'Variant not found.' };

    await prisma.productVariant.update({
      where: { id: variantId },
      data: { isActive: !existing.isActive },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: existing.isActive ? 'variant.deactivate' : 'variant.activate',
        entity: 'ProductVariant',
        entityId: variantId,
        diffJson: { sku: existing.sku },
      },
    });

    await revalidateForProduct(existing.productId);
    return { ok: true };
  } catch (error) {
    console.error('[toggleVariantActive] failed', error);
    return { ok: false, error: 'Could not update the variant.' };
  }
}

export async function deleteVariant(variantId: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(variantId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  try {
    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        sku: true,
        productId: true,
        _count: { select: { orderItems: true } },
      },
    });
    if (!existing) return { ok: false, error: 'Variant not found.' };

    // Once a variant has been ordered it is part of commercial history —
    // deactivate instead of destroying the record order lines point at.
    if (existing._count.orderItems > 0) {
      return {
        ok: false,
        error: 'This variant has orders against it — deactivate it instead.',
      };
    }

    await prisma.productVariant.delete({ where: { id: variantId } });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'variant.delete',
        entity: 'ProductVariant',
        entityId: variantId,
        diffJson: { sku: existing.sku },
      },
    });

    await revalidateForProduct(existing.productId);
    return { ok: true };
  } catch (error) {
    console.error('[deleteVariant] failed', error);
    return { ok: false, error: 'Could not delete the variant.' };
  }
}

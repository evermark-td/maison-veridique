'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { productSchema, type ProductInput } from '@/lib/validations/product';

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireStaffAction() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) return null;
  return user;
}

function revalidateProductSurfaces() {
  revalidatePath('/admin/products');
  revalidatePath('/admin');
  // Public surfaces that will render products once wired to the DB.
  revalidatePath('/');
  revalidatePath('/collections');
}

/** Unique, URL-safe slug derived from the product name. */
async function availableSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || 'piece';
  let candidate = base;
  let suffix = 2;

  for (let i = 0; i < 50; i++) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }

  throw new Error('Could not derive a unique slug.');
}

function toData(input: ProductInput) {
  return {
    name: input.name,
    description: input.description,
    story: input.story || null,
    composition: input.composition || null,
    careInstructions: input.careInstructions || null,
    basePrice: input.basePrice,
    currency: input.currency,
    collectionId: input.collectionId ?? null,
    isFeatured: input.isFeatured,
    isPublished: input.isPublished,
    sortOrder: input.sortOrder,
  };
}

export async function createProduct(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };

  try {
    const slug = await availableSlug(parsed.data.name);

    const product = await prisma.product.create({
      data: { slug, ...toData(parsed.data) },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'product.create',
        entity: 'Product',
        entityId: product.id,
        diffJson: { name: parsed.data.name, slug },
      },
    });

    revalidateProductSurfaces();
    return { ok: true, data: { id: product.id } };
  } catch (error) {
    console.error('[createProduct] failed', error);
    return { ok: false, error: 'Could not create the piece.' };
  }
}

export async function updateProduct(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };

  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: 'Piece not found.' };

    // Keep public URLs stable unless the name changed.
    const slug =
      parsed.data.name === existing.name ? existing.slug : await availableSlug(parsed.data.name, id);

    await prisma.product.update({
      where: { id },
      data: { slug, ...toData(parsed.data) },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'product.update',
        entity: 'Product',
        entityId: id,
        diffJson: { name: parsed.data.name, slug, isPublished: parsed.data.isPublished },
      },
    });

    revalidateProductSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[updateProduct] failed', error);
    return { ok: false, error: 'Could not save the piece.' };
  }
}

export async function toggleProductPublished(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { isPublished: true },
    });
    if (!existing) return { ok: false, error: 'Piece not found.' };

    const next = !existing.isPublished;

    await prisma.product.update({ where: { id }, data: { isPublished: next } });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: next ? 'product.publish' : 'product.unpublish',
        entity: 'Product',
        entityId: id,
      },
    });

    revalidateProductSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[toggleProductPublished] failed', error);
    return { ok: false, error: 'Could not update the piece.' };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { name: true, _count: { select: { variants: true } } },
    });
    if (!existing) return { ok: false, error: 'Piece not found.' };

    // Variants cascade-delete with the product (onDelete: Cascade on the relation).
    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'product.delete',
        entity: 'Product',
        entityId: id,
        diffJson: { name: existing.name, deletedVariants: existing._count.variants },
      },
    });

    revalidateProductSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[deleteProduct] failed', error);
    return { ok: false, error: 'Could not delete the piece.' };
  }
}

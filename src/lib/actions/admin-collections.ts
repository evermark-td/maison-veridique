'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { collectionSchema } from '@/lib/validations/collection';

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireStaffAction() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) return null;
  return user;
}

function revalidateCollectionSurfaces() {
  revalidatePath('/admin/collections');
  revalidatePath('/admin');
  // Public surfaces that render collections once Phase 4 wires them to the DB.
  revalidatePath('/');
  revalidatePath('/collections');
}

/** Unique, URL-safe slug derived from the title. */
async function availableSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || 'collection';
  let candidate = base;
  let suffix = 2;

  // Bounded loop — collisions beyond a handful indicate something pathological.
  for (let i = 0; i < 50; i++) {
    const existing = await prisma.collection.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }

  throw new Error('Could not derive a unique slug.');
}

export async function createCollection(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };

  try {
    const slug = await availableSlug(parsed.data.title);
    const { title, subtitle, season, year, description, isPublished, sortOrder } = parsed.data;

    const collection = await prisma.collection.create({
      data: {
        slug,
        title,
        subtitle: subtitle || null,
        season: season || null,
        year: year ?? null,
        description: description || null,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        sortOrder,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'collection.create',
        entity: 'Collection',
        entityId: collection.id,
        diffJson: { title, slug },
      },
    });

    revalidateCollectionSurfaces();
    return { ok: true, data: { id: collection.id } };
  } catch (error) {
    console.error('[createCollection] failed', error);
    return { ok: false, error: 'Could not create the collection.' };
  }
}

export async function updateCollection(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };

  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };

  try {
    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: 'Collection not found.' };

    const { title, subtitle, season, year, description, isPublished, sortOrder } = parsed.data;
    // Keep the slug stable unless the title changed — public URLs shouldn't churn.
    const slug =
      title === existing.title ? existing.slug : await availableSlug(title, id);

    await prisma.collection.update({
      where: { id },
      data: {
        slug,
        title,
        subtitle: subtitle || null,
        season: season || null,
        year: year ?? null,
        description: description || null,
        isPublished,
        publishedAt: isPublished ? (existing.publishedAt ?? new Date()) : null,
        sortOrder,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'collection.update',
        entity: 'Collection',
        entityId: id,
        diffJson: { title, slug, isPublished },
      },
    });

    revalidateCollectionSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[updateCollection] failed', error);
    return { ok: false, error: 'Could not save the collection.' };
  }
}

export async function toggleCollectionPublished(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };

  try {
    const existing = await prisma.collection.findUnique({
      where: { id },
      select: { isPublished: true, publishedAt: true },
    });
    if (!existing) return { ok: false, error: 'Collection not found.' };

    const next = !existing.isPublished;

    await prisma.collection.update({
      where: { id },
      data: {
        isPublished: next,
        publishedAt: next ? (existing.publishedAt ?? new Date()) : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: next ? 'collection.publish' : 'collection.unpublish',
        entity: 'Collection',
        entityId: id,
      },
    });

    revalidateCollectionSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[toggleCollectionPublished] failed', error);
    return { ok: false, error: 'Could not update the collection.' };
  }
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };

  try {
    const existing = await prisma.collection.findUnique({
      where: { id },
      select: { title: true, _count: { select: { products: true } } },
    });
    if (!existing) return { ok: false, error: 'Collection not found.' };

    // Products reference collections with onDelete: SetNull, so deletion never
    // cascades to garments — but surfacing the count keeps the action honest.
    await prisma.collection.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'collection.delete',
        entity: 'Collection',
        entityId: id,
        diffJson: { title: existing.title, orphanedProducts: existing._count.products },
      },
    });

    revalidateCollectionSurfaces();
    return { ok: true };
  } catch (error) {
    console.error('[deleteCollection] failed', error);
    return { ok: false, error: 'Could not delete the collection.' };
  }
}

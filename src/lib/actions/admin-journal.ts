'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { journalSchema, type JournalInput } from '@/lib/validations/journal';

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireStaffAction() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) return null;
  return user;
}

function revalidateJournal(slug?: string) {
  revalidatePath('/admin/journal');
  revalidatePath('/journal');
  if (slug) revalidatePath(`/journal/${slug}`);
}

async function availableSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || 'entry';
  let candidate = base;
  let suffix = 2;
  for (let i = 0; i < 50; i++) {
    const existing = await prisma.journalPost.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
  throw new Error('Could not derive a unique slug.');
}

function parseTags(raw?: string): string[] {
  return (raw || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function toData(input: JournalInput) {
  return {
    title: input.title,
    excerpt: input.excerpt,
    contentMdx: input.content,
    tags: parseTags(input.tags),
    readingMinutes: readingMinutes(input.content),
    isPublished: input.isPublished,
  };
}

export async function createJournalPost(input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };
  try {
    const slug = await availableSlug(parsed.data.title);
    const post = await prisma.journalPost.create({
      data: {
        slug,
        authorId: user.id,
        publishedAt: parsed.data.isPublished ? new Date() : null,
        ...toData(parsed.data),
      },
    });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'journal.create', entity: 'JournalPost', entityId: post.id },
    });
    revalidateJournal(slug);
    return { ok: true };
  } catch (error) {
    console.error('[createJournalPost] failed', error);
    return { ok: false, error: 'Could not create the entry.' };
  }
}

export async function updateJournalPost(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };
  const parsed = journalSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };
  try {
    const existing = await prisma.journalPost.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: 'Entry not found.' };
    const slug = parsed.data.title === existing.title ? existing.slug : await availableSlug(parsed.data.title, id);
    await prisma.journalPost.update({
      where: { id },
      data: {
        slug,
        // First publish stamps the date; later edits keep the original.
        publishedAt: parsed.data.isPublished ? (existing.publishedAt ?? new Date()) : null,
        ...toData(parsed.data),
      },
    });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'journal.update', entity: 'JournalPost', entityId: id },
    });
    revalidateJournal(slug);
    return { ok: true };
  } catch (error) {
    console.error('[updateJournalPost] failed', error);
    return { ok: false, error: 'Could not save the entry.' };
  }
}

export async function toggleJournalPublished(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };
  try {
    const existing = await prisma.journalPost.findUnique({
      where: { id },
      select: { isPublished: true, publishedAt: true, slug: true },
    });
    if (!existing) return { ok: false, error: 'Not found.' };
    const next = !existing.isPublished;
    await prisma.journalPost.update({
      where: { id },
      data: { isPublished: next, publishedAt: next ? (existing.publishedAt ?? new Date()) : null },
    });
    revalidateJournal(existing.slug);
    return { ok: true };
  } catch (error) {
    console.error('[toggleJournalPublished] failed', error);
    return { ok: false, error: 'Could not update the entry.' };
  }
}

export async function deleteJournalPost(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!z.string().cuid().safeParse(id).success) return { ok: false, error: 'Invalid request.' };
  try {
    const existing = await prisma.journalPost.findUnique({ where: { id }, select: { slug: true } });
    if (!existing) return { ok: false, error: 'Not found.' };
    await prisma.journalPost.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'journal.delete', entity: 'JournalPost', entityId: id },
    });
    revalidateJournal(existing.slug);
    return { ok: true };
  } catch (error) {
    console.error('[deleteJournalPost] failed', error);
    return { ok: false, error: 'Could not delete the entry.' };
  }
}

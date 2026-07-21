'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { faqSchema } from '@/lib/validations/faq';
import { testimonialSchema } from '@/lib/validations/testimonial';

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireStaffAction() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) return null;
  return user;
}

const cuid = (id: unknown) => z.string().cuid().safeParse(id).success;

// ---------------------------------------------------------------- FAQ

function revalidateFaq() {
  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidatePath('/');
}

export async function createFaq(input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };
  try {
    const faq = await prisma.faqItem.create({ data: parsed.data });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'faq.create', entity: 'FaqItem', entityId: faq.id },
    });
    revalidateFaq();
    return { ok: true };
  } catch (error) {
    console.error('[createFaq] failed', error);
    return { ok: false, error: 'Could not create the question.' };
  }
}

export async function updateFaq(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!cuid(id)) return { ok: false, error: 'Invalid request.' };
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };
  try {
    await prisma.faqItem.update({ where: { id }, data: parsed.data });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'faq.update', entity: 'FaqItem', entityId: id },
    });
    revalidateFaq();
    return { ok: true };
  } catch (error) {
    console.error('[updateFaq] failed', error);
    return { ok: false, error: 'Could not save the question.' };
  }
}

export async function toggleFaqPublished(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!cuid(id)) return { ok: false, error: 'Invalid request.' };
  try {
    const existing = await prisma.faqItem.findUnique({ where: { id }, select: { isPublished: true } });
    if (!existing) return { ok: false, error: 'Not found.' };
    await prisma.faqItem.update({ where: { id }, data: { isPublished: !existing.isPublished } });
    revalidateFaq();
    return { ok: true };
  } catch (error) {
    console.error('[toggleFaqPublished] failed', error);
    return { ok: false, error: 'Could not update the question.' };
  }
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!cuid(id)) return { ok: false, error: 'Invalid request.' };
  try {
    await prisma.faqItem.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'faq.delete', entity: 'FaqItem', entityId: id },
    });
    revalidateFaq();
    return { ok: true };
  } catch (error) {
    console.error('[deleteFaq] failed', error);
    return { ok: false, error: 'Could not delete the question.' };
  }
}

// ---------------------------------------------------------------- Testimonials

function revalidateTestimonials() {
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}

export async function createTestimonial(input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };
  try {
    const t = await prisma.testimonial.create({
      data: {
        quoteText: parsed.data.quoteText,
        authorName: parsed.data.authorName,
        authorTitle: parsed.data.authorTitle || null,
        sortOrder: parsed.data.sortOrder,
        isPublished: parsed.data.isPublished,
      },
    });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'testimonial.create', entity: 'Testimonial', entityId: t.id },
    });
    revalidateTestimonials();
    return { ok: true };
  } catch (error) {
    console.error('[createTestimonial] failed', error);
    return { ok: false, error: 'Could not create the testimonial.' };
  }
}

export async function updateTestimonial(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!cuid(id)) return { ok: false, error: 'Invalid request.' };
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Please check the form.' };
  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        quoteText: parsed.data.quoteText,
        authorName: parsed.data.authorName,
        authorTitle: parsed.data.authorTitle || null,
        sortOrder: parsed.data.sortOrder,
        isPublished: parsed.data.isPublished,
      },
    });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'testimonial.update', entity: 'Testimonial', entityId: id },
    });
    revalidateTestimonials();
    return { ok: true };
  } catch (error) {
    console.error('[updateTestimonial] failed', error);
    return { ok: false, error: 'Could not save the testimonial.' };
  }
}

export async function toggleTestimonialPublished(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!cuid(id)) return { ok: false, error: 'Invalid request.' };
  try {
    const existing = await prisma.testimonial.findUnique({ where: { id }, select: { isPublished: true } });
    if (!existing) return { ok: false, error: 'Not found.' };
    await prisma.testimonial.update({ where: { id }, data: { isPublished: !existing.isPublished } });
    revalidateTestimonials();
    return { ok: true };
  } catch (error) {
    console.error('[toggleTestimonialPublished] failed', error);
    return { ok: false, error: 'Could not update the testimonial.' };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };
  if (!cuid(id)) return { ok: false, error: 'Invalid request.' };
  try {
    await prisma.testimonial.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { actorId: user.id, action: 'testimonial.delete', entity: 'Testimonial', entityId: id },
    });
    revalidateTestimonials();
    return { ok: true };
  } catch (error) {
    console.error('[deleteTestimonial] failed', error);
    return { ok: false, error: 'Could not delete the testimonial.' };
  }
}

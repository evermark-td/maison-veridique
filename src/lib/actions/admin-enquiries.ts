'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export type ActionResult = { ok: true } | { ok: false; error: string };

const updateStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['NEW', 'IN_PROGRESS', 'CLOSED']),
});

/**
 * Staff-only status transition for an enquiry. Authorisation is enforced HERE,
 * inside the action — middleware only guards page navigation, and server
 * actions are network-callable endpoints in their own right.
 */
export async function updateEnquiryStatus(input: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return { ok: false, error: 'Not authorised.' };
  }

  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Invalid request.' };
  }

  const { id, status } = parsed.data;

  try {
    const existing = await prisma.enquiry.findUnique({ where: { id }, select: { status: true } });
    if (!existing) return { ok: false, error: 'Enquiry not found.' };

    await prisma.$transaction([
      prisma.enquiry.update({
        where: { id },
        data: {
          status,
          // Whoever moves it out of NEW owns it; clearing happens on reopen.
          handledById: status === 'NEW' ? null : user.id,
        },
      }),
      prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'enquiry.status',
          entity: 'Enquiry',
          entityId: id,
          diffJson: { from: existing.status, to: status },
        },
      }),
    ]);

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin');

    return { ok: true };
  } catch (error) {
    console.error('[updateEnquiryStatus] failed', error);
    return { ok: false, error: 'Could not update the enquiry.' };
  }
}

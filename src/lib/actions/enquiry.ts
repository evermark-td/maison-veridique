'use server';

import { prisma } from '@/lib/prisma';
import { enquirySchema } from '@/lib/validations/enquiry';

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Persists a client enquiry. The Zod schema is the same one the form uses as
 * its RHF resolver — but it is re-validated here, because client-side
 * validation is a convenience, never a trust boundary.
 */
export async function submitEnquiry(input: unknown): Promise<ActionResult> {
  const parsed = enquirySchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: 'Please check the form and try again.' };
  }

  const { fullName, email, phone, type, message } = parsed.data;

  try {
    await prisma.enquiry.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        phone: phone?.trim() ? phone.trim() : null,
        type,
        message,
        // status defaults to NEW — the admin inbox works from this.
      },
    });

    return { ok: true };
  } catch (error) {
    console.error('[submitEnquiry] failed to persist enquiry', error);
    return {
      ok: false,
      error: 'We could not send your enquiry. Please try again, or email us directly.',
    };
  }
}

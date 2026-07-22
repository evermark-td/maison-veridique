'use server';

import { sendEmail } from '@/lib/email/client';
import {
  enquiryAcknowledgementEmail,
  enquiryNotificationEmail,
} from '@/lib/email/templates/enquiry';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { enquirySchema } from '@/lib/validations/enquiry';

export type ActionResult = { ok: true } | { ok: false; error: string };

// House inboxes (see src/config/contact.ts). Press enquiries go to the press
// desk; everything else to client services. ENQUIRIES_TO overrides both, which
// is useful for staging where a single catch-all inbox is preferred.
const CLIENT_SERVICES_INBOX = 'clients@maisonveridique.com';
const PRESS_INBOX = 'press@maisonveridique.com';

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
  const normalisedEmail = email.toLowerCase();
  const normalisedPhone = phone?.trim() ? phone.trim() : null;

  try {
    await prisma.enquiry.create({
      data: {
        fullName,
        email: normalisedEmail,
        phone: normalisedPhone,
        type,
        message,
        // status defaults to NEW — the admin inbox works from this.
      },
    });

    // Notify the house and acknowledge the client — both best-effort. A failed
    // or skipped send must never fail an enquiry already saved to the inbox.
    try {
      const houseInbox =
        env.ENQUIRIES_TO ?? (type === 'PRESS' ? PRESS_INBOX : CLIENT_SERVICES_INBOX);
      const enquiryData = {
        type,
        fullName,
        email: normalisedEmail,
        phone: normalisedPhone,
        message,
        receivedAt: new Date(),
      };

      const notification = enquiryNotificationEmail(enquiryData);
      const acknowledgement = enquiryAcknowledgementEmail({ type, fullName });

      await Promise.all([
        // replyTo lets an advisor answer the client straight from the inbox.
        sendEmail({ to: houseInbox, replyTo: normalisedEmail, ...notification }),
        sendEmail({ to: normalisedEmail, ...acknowledgement }),
      ]);
    } catch (error) {
      console.error('[submitEnquiry] notification email failed', error);
    }

    return { ok: true };
  } catch (error) {
    console.error('[submitEnquiry] failed to persist enquiry', error);
    return {
      ok: false,
      error: 'We could not send your enquiry. Please try again, or email us directly.',
    };
  }
}

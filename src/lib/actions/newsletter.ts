'use server';

import { randomBytes } from 'node:crypto';

import { sendEmail } from '@/lib/email/client';
import { newsletterConfirmationEmail } from '@/lib/email/templates/newsletter-confirmation';
import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/seo';
import { newsletterSchema } from '@/lib/validations/newsletter';

export type ActionResult = { ok: true } | { ok: false; error: string };

function newToken() {
  return randomBytes(32).toString('hex');
}

/**
 * Creates (or refreshes) a pending subscriber and issues a double opt-in token.
 *
 * The response is deliberately identical whether or not the address is already
 * on the list: telling an anonymous caller "that email is already subscribed"
 * leaks membership of the list to anyone who can guess an address.
 */
export async function subscribeToNewsletter(input: unknown): Promise<ActionResult> {
  const parsed = newsletterSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (existing?.confirmedAt) {
      // Already confirmed — no new token, no duplicate row, same response.
      return { ok: true };
    }

    const token = newToken();

    await prisma.subscriber.upsert({
      where: { email },
      // Re-issue a fresh token so a stale/lost confirmation link can't strand them.
      update: { token, unsubscribedAt: null },
      create: { email, token, source: 'footer' },
    });

    // Send the double opt-in link. A failed or skipped send (e.g. no API key in
    // development) must not fail the request — the caller can re-submit to get a
    // fresh token and email, and we never reveal list membership either way.
    const confirmUrl = `${siteConfig.url}/api/newsletter/confirm?token=${token}`;
    const { subject, html, text } = newsletterConfirmationEmail(confirmUrl);
    await sendEmail({ to: email, subject, html, text });

    return { ok: true };
  } catch (error) {
    console.error('[subscribeToNewsletter] failed', error);
    return { ok: false, error: 'We could not subscribe you. Please try again.' };
  }
}

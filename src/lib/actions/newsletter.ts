'use server';

import { randomBytes } from 'node:crypto';

import { prisma } from '@/lib/prisma';
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

    // Phase 4 (email): send the confirmation link containing `token`.
    return { ok: true };
  } catch (error) {
    console.error('[subscribeToNewsletter] failed', error);
    return { ok: false, error: 'We could not subscribe you. Please try again.' };
  }
}

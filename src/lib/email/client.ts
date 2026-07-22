import { Resend } from 'resend';

import { env } from '@/lib/env';

// The house sender. Resend requires the domain to be verified in production;
// EMAIL_FROM lets deployments override it without touching code.
const DEFAULT_FROM = 'Maison Véridique <no-reply@maisonveridique.com>';

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Optional reply-to, e.g. a client-services inbox for order notifications. */
  replyTo?: string;
};

export type SendEmailResult =
  { ok: true; id: string | null } | { ok: false; skipped: true } | { ok: false; error: string };

// Instantiated once, lazily — only when a key is actually present.
let client: Resend | null = null;

function getClient(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  client ??= new Resend(env.RESEND_API_KEY);
  return client;
}

/**
 * Sends a transactional email through Resend.
 *
 * When `RESEND_API_KEY` is unset (local development, preview environments), the
 * send is skipped rather than failing — email is an "optional service", so the
 * flows that call this must still succeed without it. Callers should treat a
 * skipped or failed send as non-fatal and never block the user on it.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resend = getClient();

  if (!resend) {
    if (env.NODE_ENV !== 'production') {
      console.info(`[email] skipped (no RESEND_API_KEY) — "${input.subject}" → ${input.to}`);
    }
    return { ok: false, skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM ?? DEFAULT_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });

    if (error) {
      console.error('[email] send failed', error);
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id ?? null };
  } catch (error) {
    console.error('[email] send threw', error);
    return { ok: false, error: 'Email send failed.' };
  }
}

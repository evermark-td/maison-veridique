'use server';

import bcrypt from 'bcryptjs';

import { sendEmail } from '@/lib/email/client';
import { welcomeEmail } from '@/lib/email/templates/welcome';
import { prisma } from '@/lib/prisma';
import { signUpSchema } from '@/lib/validations/auth';

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Creates a new customer account (role USER). Staff roles are only ever granted
 * through the seed or the admin, never through public sign-up.
 */
export async function signUp(input: unknown): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: 'Please check the form and try again.' };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // A generic message — do not confirm which emails already hold an account.
      return { ok: false, error: 'That email cannot be used. Try signing in instead.' };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const name = parsed.data.name.trim();

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'USER',
      },
    });

    // Welcome email — best-effort. A failed or skipped send must never fail an
    // account that has already been created.
    try {
      const { subject, html, text } = welcomeEmail(name);
      await sendEmail({ to: email, subject, html, text });
    } catch (error) {
      console.error('[signUp] welcome email failed', error);
    }

    return { ok: true };
  } catch (error) {
    console.error('[signUp] failed to create user', error);
    return { ok: false, error: 'We could not create your account. Please try again.' };
  }
}

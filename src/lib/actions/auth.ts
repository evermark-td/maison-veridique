'use server';

import bcrypt from 'bcryptjs';

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

    await prisma.user.create({
      data: {
        name: parsed.data.name.trim(),
        email,
        passwordHash,
        role: 'USER',
      },
    });

    return { ok: true };
  } catch (error) {
    console.error('[signUp] failed to create user', error);
    return { ok: false, error: 'We could not create your account. Please try again.' };
  }
}

import { NextResponse, type NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/seo';

/**
 * Double opt-in confirmation. The token is single-use: once confirmed it is
 * rotated, so a leaked or re-shared link cannot be replayed.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  const redirectTo = (status: 'confirmed' | 'invalid') =>
    NextResponse.redirect(new URL(`/?newsletter=${status}`, siteConfig.url));

  if (!token) return redirectTo('invalid');

  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { token } });

    if (!subscriber) return redirectTo('invalid');

    if (subscriber.confirmedAt) {
      // Already confirmed — treat as success, don't error the client.
      return redirectTo('confirmed');
    }

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        confirmedAt: new Date(),
        unsubscribedAt: null,
        // Burn the token so the link cannot be reused.
        token: `used_${subscriber.id}_${Date.now()}`,
      },
    });

    return redirectTo('confirmed');
  } catch (error) {
    console.error('[newsletter/confirm] failed', error);
    return redirectTo('invalid');
  }
}

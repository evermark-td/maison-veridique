import { NextResponse, type NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { siteConfig } from '@/lib/seo';

/**
 * One-click unsubscribe (RFC 8058 style): no auth, idempotent. The `id` is an
 * opaque cuid — not personal data and not enumerable — so it is safe in the URL.
 * Re-visiting the link after unsubscribing is a no-op, not an error.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  const redirectTo = (status: 'unsubscribed' | 'invalid') =>
    NextResponse.redirect(new URL(`/?newsletter=${status}`, siteConfig.url));

  if (!id) return redirectTo('invalid');

  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { id } });

    if (!subscriber) return redirectTo('invalid');

    // Only write when the state actually changes — keeps the first
    // unsubscribedAt timestamp stable across repeat clicks.
    if (!subscriber.unsubscribedAt) {
      await prisma.subscriber.update({
        where: { id },
        data: { unsubscribedAt: new Date() },
      });
    }

    return redirectTo('unsubscribed');
  } catch (error) {
    console.error('[newsletter/unsubscribe] failed', error);
    return redirectTo('invalid');
  }
}

import type { UserRole } from '@prisma/client';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Google is only registered when real credentials exist. Registering the
 * provider with empty strings makes every /api/auth/* route fail with a
 * "server configuration" error — which the client SessionProvider surfaces
 * as `ClientFetchError: Failed to fetch`.
 */
const googleConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

/**
 * Edge-safe slice of the auth config: no Prisma, no bcrypt.
 * Consumed by middleware.ts and extended in lib/auth.ts.
 */
export const authConfig = {
  // Auth routes are served from our own host (localhost in dev, the deployed
  // domain in prod). Without this, production throws UntrustedHost on every
  // /api/auth/* request — the same failed-fetch symptom.
  trustHost: true,
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in',
  },
  session: { strategy: 'jwt' },
  providers: googleConfigured
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
          allowDangerousEmailAccountLinking: false,
        }),
      ]
    : [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const role = auth?.user?.role;

      if (pathname.startsWith('/admin')) {
        return role === 'ADMIN' || role === 'EDITOR';
      }

      if (pathname.startsWith('/account')) {
        return Boolean(auth?.user);
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

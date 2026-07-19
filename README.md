# Maison Véridique

Luxury fashion house — Next.js 15 (App Router), TypeScript, Tailwind v4, shadcn/ui,
Framer Motion, Prisma + PostgreSQL, NextAuth v5, React Hook Form + Zod, TanStack Query.

## Requirements

- Node.js **20.11+**
- PostgreSQL 15+ (local, Neon, or Supabase)

## Setup

```bash
npm install
cp .env.example .env          # then fill DATABASE_URL and AUTH_SECRET
npx auth secret               # writes AUTH_SECRET
npm run db:push               # or: npm run db:migrate
npm run db:seed
npm run dev
```

Seeded admin: `admin@maisonveridique.com` / `Veridique!2026` — change before any deploy.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Prisma generate + production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create + apply a migration |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | Seed reference data |

## Structure

```
src/
  app/          routes (marketing, shop, account, auth, admin, api)
  components/   ui/ layout/ sections/ product/ editorial/ motion/ admin/ forms/
  lib/          prisma, auth, seo, fonts, utils, env, validations/
  hooks/        client hooks
  providers/    session + query providers
  styles/       globals.css (design tokens)
prisma/         schema.prisma, seed.ts
```

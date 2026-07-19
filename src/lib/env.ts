import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const isServer = typeof window === 'undefined';

function parseEnv() {
  const client = clientSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!client.success) {
    throw new Error(
      `Invalid client environment variables:\n${client.error.issues
        .map((i) => ` - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    );
  }

  if (!isServer) {
    return { ...client.data } as z.infer<typeof clientSchema> & Partial<z.infer<typeof serverSchema>>;
  }

  const server = serverSchema.safeParse(process.env);

  if (!server.success) {
    throw new Error(
      `Invalid server environment variables:\n${server.error.issues
        .map((i) => ` - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    );
  }

  return { ...client.data, ...server.data };
}

export const env = parseEnv();

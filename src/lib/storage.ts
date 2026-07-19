import { randomBytes } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Local-disk storage driver: files land in public/uploads and are served
 * statically at /uploads/*. The interface (save/remove by public URL) is the
 * contract — a Vercel Blob or S3 driver drops in behind it at deploy time
 * without touching callers.
 */

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PUBLIC_PREFIX = '/uploads/';

export async function saveUpload(buffer: Buffer, extension: string): Promise<{ url: string }> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${randomBytes(8).toString('hex')}.${extension}`;
  await writeFile(path.join(UPLOAD_DIR, name), buffer);
  return { url: `${PUBLIC_PREFIX}${name}` };
}

export async function removeUpload(url: string): Promise<void> {
  if (!url.startsWith(PUBLIC_PREFIX)) return; // never touch anything outside /uploads
  const name = path.basename(url); // strips any traversal
  try {
    await unlink(path.join(UPLOAD_DIR, name));
  } catch {
    // Already gone — removal is idempotent.
  }
}

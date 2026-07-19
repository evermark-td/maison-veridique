'use server';

import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { z } from 'zod';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { removeUpload, saveUpload } from '@/lib/storage';

export type ActionResult = { ok: true } | { ok: false; error: string };

const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

async function requireStaffAction() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) return null;
  return user;
}

function revalidateProductSurfaces(productSlug: string, collectionSlug?: string | null) {
  revalidatePath(`/products/${productSlug}`);
  if (collectionSlug) revalidatePath(`/collections/${collectionSlug}`);
  revalidatePath('/collections');
  revalidatePath('/admin/products');
}

/**
 * Uploads one image and attaches it to a product. The file is decoded with
 * sharp before anything is stored — a file that doesn't parse as an image is
 * rejected regardless of its claimed MIME type.
 */
export async function uploadProductImage(
  productId: string,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(productId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file received.' };

  const extension = ALLOWED[file.type];
  if (!extension) return { ok: false, error: 'Use a JPEG, PNG, WebP or AVIF image.' };
  if (file.size > MAX_BYTES) return { ok: false, error: 'Images must be under 8 MB.' };

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        slug: true,
        collection: { select: { slug: true } },
        _count: { select: { images: true } },
      },
    });
    if (!product) return { ok: false, error: 'Piece not found.' };

    const buffer = Buffer.from(await file.arrayBuffer());

    // Decode-or-reject, and derive dimensions + a tiny blur placeholder.
    const image = sharp(buffer);
    const meta = await image.metadata();
    if (!meta.width || !meta.height) return { ok: false, error: 'That file is not a valid image.' };

    const blurBuffer = await image
      .clone()
      .resize(12, 12, { fit: 'inside' })
      .jpeg({ quality: 45 })
      .toBuffer();

    const { url } = await saveUpload(buffer, extension);

    await prisma.$transaction(async (tx) => {
      const media = await tx.media.create({
        data: {
          url,
          blurDataUrl: `data:image/jpeg;base64,${blurBuffer.toString('base64')}`,
          width: meta.width as number,
          height: meta.height as number,
          mimeType: file.type,
          alt: product.name,
          uploadedById: user.id,
        },
      });

      await tx.productImage.create({
        data: {
          productId,
          mediaId: media.id,
          alt: product.name,
          sortOrder: product._count.images,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'product.image.add',
          entity: 'Product',
          entityId: productId,
          diffJson: { url },
        },
      });
    });

    revalidateProductSurfaces(product.slug, product.collection?.slug);
    return { ok: true };
  } catch (error) {
    console.error('[uploadProductImage] failed', error);
    return { ok: false, error: 'Could not upload the image.' };
  }
}

export async function deleteProductImage(productImageId: string): Promise<ActionResult> {
  const user = await requireStaffAction();
  if (!user) return { ok: false, error: 'Not authorised.' };

  if (!z.string().cuid().safeParse(productImageId).success) {
    return { ok: false, error: 'Invalid request.' };
  }

  try {
    const image = await prisma.productImage.findUnique({
      where: { id: productImageId },
      include: {
        media: { select: { id: true, url: true } },
        product: { select: { id: true, slug: true, collection: { select: { slug: true } } } },
      },
    });
    if (!image) return { ok: false, error: 'Image not found.' };

    // Media rows are one-to-one with uploads here; deleting the Media cascades
    // the ProductImage (mediaId onDelete: Cascade).
    await prisma.media.delete({ where: { id: image.media.id } });
    await removeUpload(image.media.url);

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'product.image.remove',
        entity: 'Product',
        entityId: image.product.id,
        diffJson: { url: image.media.url },
      },
    });

    revalidateProductSurfaces(image.product.slug, image.product.collection?.slug);
    return { ok: true };
  } catch (error) {
    console.error('[deleteProductImage] failed', error);
    return { ok: false, error: 'Could not remove the image.' };
  }
}

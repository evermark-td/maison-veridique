'use client';

import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useTransition } from 'react';
import { toast } from 'sonner';

import { deleteProductImage, uploadProductImage } from '@/lib/actions/admin-media';
import { cn } from '@/lib/utils';

export type ProductImageItem = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
};

export function ProductMediaManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImageItem[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function onFileChosen(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadProductImage(productId, formData);
      if (inputRef.current) inputRef.current.value = '';
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success('Image added.');
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteProductImage(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section aria-label="Product imagery" className="mt-14 max-w-2xl border-t border-border pt-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="label-micro">Imagery</p>
          <p className="mt-2 text-caption text-muted-foreground">
            The first image leads the product page and collection card. JPEG, PNG, WebP or AVIF,
            up to 8 MB.
          </p>
        </div>

        <label
          className={cn(
            'flex cursor-pointer items-center gap-2 border border-foreground px-5 py-2.5 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background',
            pending && 'pointer-events-none opacity-40',
          )}
        >
          <ImagePlus className="size-4" strokeWidth={1.5} aria-hidden />
          {pending ? 'Working…' : 'Add image'}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(event) => onFileChosen(event.target.files)}
            disabled={pending}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <p className="mt-8 text-body text-muted-foreground">No imagery yet.</p>
      ) : (
        <ul className={cn('mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3', pending && 'opacity-40')}>
          {images.map((image, index) => (
            <li key={image.id} className="group relative">
              <div className="relative aspect-4/5 overflow-hidden bg-bone">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 220px, 45vw"
                  className="object-cover"
                />
              </div>
              {index === 0 ? (
                <span className="absolute left-2 top-2 bg-noir/60 px-2 py-0.5 text-micro font-medium tracking-[0.16em] uppercase text-paper">
                  Lead
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => remove(image.id)}
                aria-label="Remove image"
                className="absolute right-2 top-2 inline-flex size-8 items-center justify-center bg-noir/60 text-paper opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

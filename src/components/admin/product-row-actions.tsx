'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { deleteProduct, toggleProductPublished } from '@/lib/actions/admin-products';
import { cn } from '@/lib/utils';

const actionClass =
  'border-b border-foreground/60 pb-0.5 text-micro font-medium tracking-[0.16em] uppercase text-foreground/70 transition-colors duration-300 hover:border-foreground hover:text-foreground';

export function ProductRowActions({ id, isPublished }: { id: string; isPublished: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  // Explicit refresh after each mutation — a plain server-action call doesn't
  // reliably repaint an already-rendered client tree on its own.
  function togglePublish() {
    startTransition(async () => {
      const result = await toggleProductPublished(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteProduct(id);
      setConfirming(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className={cn('flex items-center gap-5', pending && 'pointer-events-none opacity-40')}>
      {confirming ? (
        <>
          <span className="text-caption text-destructive">Delete this piece?</span>
          <button
            type="button"
            onClick={remove}
            className={cn(
              actionClass,
              'border-destructive/60 text-destructive hover:border-destructive hover:text-destructive',
            )}
          >
            Yes, delete
          </button>
          <button type="button" onClick={() => setConfirming(false)} className={actionClass}>
            Keep
          </button>
        </>
      ) : (
        <>
          <Link href={`/admin/products/${id}`} className={actionClass}>
            Edit
          </Link>
          <button type="button" onClick={togglePublish} className={actionClass}>
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button type="button" onClick={() => setConfirming(true)} className={actionClass}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

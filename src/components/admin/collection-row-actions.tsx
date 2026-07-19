'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  deleteCollection,
  toggleCollectionPublished,
} from '@/lib/actions/admin-collections';
import { cn } from '@/lib/utils';

const actionClass =
  'border-b border-foreground/60 pb-0.5 text-micro font-medium tracking-[0.16em] uppercase text-foreground/70 transition-colors duration-300 hover:border-foreground hover:text-foreground';

export function CollectionRowActions({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  // `revalidatePath` inside the server action invalidates the cache entry,
  // but does not reliably refetch an already-rendered client tree when the
  // action is a plain call (not a <form action>) — router.refresh() is the
  // explicit, dependable way to pull the new server data in.
  function togglePublish() {
    startTransition(async () => {
      const result = await toggleCollectionPublished(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteCollection(id);
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
          <span className="text-caption text-destructive">Delete this collection?</span>
          <button type="button" onClick={remove} className={cn(actionClass, 'text-destructive border-destructive/60 hover:border-destructive hover:text-destructive')}>
            Yes, delete
          </button>
          <button type="button" onClick={() => setConfirming(false)} className={actionClass}>
            Keep
          </button>
        </>
      ) : (
        <>
          <Link href={`/admin/collections/${id}`} className={actionClass}>
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

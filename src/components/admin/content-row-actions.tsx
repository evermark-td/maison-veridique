'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

type Result = { ok: true } | { ok: false; error: string };

const actionClass =
  'border-b border-foreground/60 pb-0.5 text-micro font-medium tracking-[0.16em] uppercase text-foreground/70 transition-colors duration-300 hover:border-foreground hover:text-foreground';

/**
 * Reusable publish-toggle + delete row controls for the simple content
 * entities (FAQ, testimonials, journal). Server actions are passed in.
 */
export function ContentRowActions({
  id,
  isPublished,
  editHref,
  onToggle,
  onDelete,
  confirmLabel = 'Delete this entry?',
}: {
  id: string;
  isPublished: boolean;
  editHref: string;
  onToggle: (id: string) => Promise<Result>;
  onDelete: (id: string) => Promise<Result>;
  confirmLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function toggle() {
    startTransition(async () => {
      const result = await onToggle(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await onDelete(id);
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
          <span className="text-caption text-destructive">{confirmLabel}</span>
          <button
            type="button"
            onClick={remove}
            className={cn(actionClass, 'border-destructive/60 text-destructive hover:border-destructive hover:text-destructive')}
          >
            Yes, delete
          </button>
          <button type="button" onClick={() => setConfirming(false)} className={actionClass}>
            Keep
          </button>
        </>
      ) : (
        <>
          <Link href={editHref} className={actionClass}>
            Edit
          </Link>
          <button type="button" onClick={toggle} className={actionClass}>
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

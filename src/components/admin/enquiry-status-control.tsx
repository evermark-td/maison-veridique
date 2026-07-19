'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { updateEnquiryStatus } from '@/lib/actions/admin-enquiries';
import { cn } from '@/lib/utils';

const TRANSITIONS: Record<string, { label: string; next: 'NEW' | 'IN_PROGRESS' | 'CLOSED' }[]> = {
  NEW: [
    { label: 'Take on', next: 'IN_PROGRESS' },
    { label: 'Close', next: 'CLOSED' },
  ],
  IN_PROGRESS: [
    { label: 'Close', next: 'CLOSED' },
    { label: 'Back to new', next: 'NEW' },
  ],
  CLOSED: [{ label: 'Reopen', next: 'IN_PROGRESS' }],
};

export function EnquiryStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const actions = TRANSITIONS[status] ?? [];

  // Explicit refresh — a plain server-action call doesn't reliably repaint an
  // already-rendered client tree with the new server data on its own.
  function transition(next: 'NEW' | 'IN_PROGRESS' | 'CLOSED') {
    startTransition(async () => {
      const result = await updateEnquiryStatus({ id, status: next });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className={cn('flex items-center gap-4', pending && 'pointer-events-none opacity-40')}>
      {actions.map((action) => (
        <button
          key={action.next}
          type="button"
          onClick={() => transition(action.next)}
          disabled={pending}
          className="border-b border-foreground/60 pb-0.5 text-micro font-medium tracking-[0.16em] uppercase text-foreground/70 transition-colors duration-300 hover:border-foreground hover:text-foreground"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

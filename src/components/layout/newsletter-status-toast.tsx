'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

// The newsletter confirm and unsubscribe routes redirect here with a status in
// the `newsletter` query param. Surface it as a toast, then strip the param so a
// refresh or shared URL does not replay it.
const MESSAGES: Record<string, { title: string; description: string; kind: 'success' | 'error' }> =
  {
    confirmed: {
      title: 'Subscription confirmed',
      description: 'You are now on the house list.',
      kind: 'success',
    },
    unsubscribed: {
      title: 'You have unsubscribed',
      description: 'You will no longer receive the house newsletter.',
      kind: 'success',
    },
    invalid: {
      title: 'This link has expired',
      description: 'That newsletter link is no longer valid.',
      kind: 'error',
    },
  };

export function NewsletterStatusToast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const status = params.get('newsletter');
  // Guards against the effect firing twice (React strict mode / re-renders).
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!status || handled.current === status) return;
    const message = MESSAGES[status];
    if (!message) return;

    handled.current = status;
    const notify = message.kind === 'success' ? toast.success : toast.error;
    notify(message.title, { description: message.description });

    // Drop only the newsletter param, preserving anything else on the URL.
    const next = new URLSearchParams(params);
    next.delete('newsletter');
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [status, params, pathname, router]);

  return null;
}

'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { toggleWishlist } from '@/lib/actions/wishlist';
import { cn } from '@/lib/utils';

export function WishlistButton({
  productId,
  initialSaved,
  isSignedIn,
}: {
  productId: string;
  initialSaved: boolean;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!isSignedIn) {
      toast.error('Sign in to save pieces.');
      router.push('/auth/sign-in?next=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Optimistic — reconcile with the server result.
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (!result.ok) {
        setSaved(!next);
        toast.error(result.error);
        return;
      }
      setSaved(result.saved);
      toast.success(result.saved ? 'Saved to your wishlist.' : 'Removed from your wishlist.');
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      className={cn(
        'inline-flex items-center gap-2 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 disabled:opacity-50',
        saved ? 'text-foreground' : 'text-foreground/60 hover:text-foreground',
      )}
    >
      <Heart
        className={cn('size-4 transition-all duration-300', saved && 'fill-current')}
        strokeWidth={1.5}
        aria-hidden
      />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}

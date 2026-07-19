'use client';

import { signOut } from 'next-auth/react';

import { cn } from '@/lib/utils';

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/' })}
      className={cn(
        'text-micro font-medium tracking-[0.16em] uppercase text-foreground/60 transition-colors duration-300 hover:text-foreground',
        className,
      )}
    >
      Sign out
    </button>
  );
}

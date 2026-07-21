'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchField({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  }

  return (
    <form onSubmit={onSubmit} role="search" className="flex items-center gap-4 border-b border-foreground pb-3">
      <Search className="size-5 shrink-0 text-foreground/60" strokeWidth={1.25} aria-hidden />
      <label htmlFor="q" className="sr-only">
        Search
      </label>
      <input
        id="q"
        name="q"
        type="search"
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search pieces and collections…"
        className="w-full bg-transparent text-lead text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
      />
    </form>
  );
}

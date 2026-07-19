import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-start justify-center gap-6">
      <p className="label-micro">404</p>
      <h1 className="display text-d3">This page is not part of the collection.</h1>
      <Link
        href="/"
        className="border-b border-foreground pb-1 text-micro font-medium uppercase tracking-[0.16em]"
      >
        Return home
      </Link>
    </main>
  );
}

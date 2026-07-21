import Link from 'next/link';

import { ContentRowActions } from '@/components/admin/content-row-actions';
import { deleteJournalPost, toggleJournalPublished } from '@/lib/actions/admin-journal';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDate } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Journal — Admin', path: '/admin/journal', noIndex: true });
export const dynamic = 'force-dynamic';

export default async function AdminJournalPage() {
  const posts = await prisma.journalPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-micro">Journal</p>
          <h1 className="display mt-3 text-d3">Entries.</h1>
        </div>
        <Link href="/admin/journal/new" className="border border-foreground px-6 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background">
          New entry
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-body text-muted-foreground">No entries yet.</p>
      ) : (
        <ul className="mt-10">
          {posts.map((post) => (
            <li key={post.id} className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-border py-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="display text-d4">{post.title}</p>
                <p className="mt-1 text-caption text-muted-foreground">
                  /{post.slug} · {post.readingMinutes} min
                  {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
                </p>
              </div>
              <div className="lg:col-span-3">
                <span className={cn('inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase', post.isPublished ? 'bg-foreground text-background' : 'border border-border text-muted-foreground')}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="lg:col-span-3 lg:justify-self-end">
                <ContentRowActions id={post.id} isPublished={post.isPublished} editHref={`/admin/journal/${post.id}`} onToggle={toggleJournalPublished} onDelete={deleteJournalPost} confirmLabel="Delete this entry?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

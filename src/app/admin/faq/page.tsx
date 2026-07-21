import Link from 'next/link';

import { ContentRowActions } from '@/components/admin/content-row-actions';
import { deleteFaq, toggleFaqPublished } from '@/lib/actions/admin-content';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'FAQ — Admin', path: '/admin/faq', noIndex: true });
export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] });

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-micro">FAQ</p>
          <h1 className="display mt-3 text-d3">Questions.</h1>
        </div>
        <Link href="/admin/faq/new" className="border border-foreground px-6 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background">
          New question
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-body text-muted-foreground">No questions yet.</p>
      ) : (
        <ul className="mt-10">
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-border py-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="text-body">{item.question}</p>
                <p className="mt-1 label-micro">{item.category}</p>
              </div>
              <div className="lg:col-span-3">
                <span className={cn('inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase', item.isPublished ? 'bg-foreground text-background' : 'border border-border text-muted-foreground')}>
                  {item.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="lg:col-span-3 lg:justify-self-end">
                <ContentRowActions id={item.id} isPublished={item.isPublished} editHref={`/admin/faq/${item.id}`} onToggle={toggleFaqPublished} onDelete={deleteFaq} confirmLabel="Delete this question?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

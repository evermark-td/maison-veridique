import Link from 'next/link';

import { ContentRowActions } from '@/components/admin/content-row-actions';
import { deleteTestimonial, toggleTestimonialPublished } from '@/lib/actions/admin-content';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const metadata = buildMetadata({ title: 'Testimonials — Admin', path: '/admin/testimonials', noIndex: true });
export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <div className="container-page py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label-micro">Testimonials</p>
          <h1 className="display mt-3 text-d3">In the press.</h1>
        </div>
        <Link href="/admin/testimonials/new" className="border border-foreground px-6 py-3 text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background">
          New testimonial
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-body text-muted-foreground">No testimonials yet.</p>
      ) : (
        <ul className="mt-10">
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-border py-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="text-body italic">“{item.quoteText}”</p>
                <p className="mt-2 label-micro normal-case tracking-[0.16em]">
                  {item.authorName}
                  {item.authorTitle ? ` · ${item.authorTitle}` : ''}
                </p>
              </div>
              <div className="lg:col-span-2">
                <span className={cn('inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase', item.isPublished ? 'bg-foreground text-background' : 'border border-border text-muted-foreground')}>
                  {item.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="lg:col-span-3 lg:justify-self-end">
                <ContentRowActions id={item.id} isPublished={item.isPublished} editHref={`/admin/testimonials/${item.id}`} onToggle={toggleTestimonialPublished} onDelete={deleteTestimonial} confirmLabel="Delete this testimonial?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

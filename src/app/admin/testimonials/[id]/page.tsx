import { notFound } from 'next/navigation';

import { TestimonialForm } from '@/components/admin/testimonial-form';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'Edit Testimonial — Admin', path: '/admin/testimonials', noIndex: true });
export const dynamic = 'force-dynamic';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) notFound();

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Testimonials</p>
      <h1 className="display mt-3 text-d3">Edit testimonial.</h1>
      <div className="mt-10">
        <TestimonialForm
          testimonialId={t.id}
          defaultValues={{
            quoteText: t.quoteText,
            authorName: t.authorName,
            authorTitle: t.authorTitle ?? '',
            sortOrder: t.sortOrder,
            isPublished: t.isPublished,
          }}
        />
      </div>
    </div>
  );
}

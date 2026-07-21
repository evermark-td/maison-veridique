import { notFound } from 'next/navigation';

import { FaqForm } from '@/components/admin/faq-form';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'Edit Question — Admin', path: '/admin/faq', noIndex: true });
export const dynamic = 'force-dynamic';

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.faqItem.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">FAQ</p>
      <h1 className="display mt-3 text-d3">Edit question.</h1>
      <div className="mt-10">
        <FaqForm
          faqId={faq.id}
          defaultValues={{
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            sortOrder: faq.sortOrder,
            isPublished: faq.isPublished,
          }}
        />
      </div>
    </div>
  );
}

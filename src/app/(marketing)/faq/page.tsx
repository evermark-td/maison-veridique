import { Faq } from '@/components/sections/faq';
import { faqContent } from '@/config/faq';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Questions',
  description:
    'Appointments, shipping, payment and garment care — the questions our client advisors are asked most.',
  path: '/faq',
});

export const revalidate = 300;

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({
    where: { isPublished: true },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    select: { id: true, question: true, answer: true, category: true },
  });

  // Fall back to the editorial defaults if the table is empty.
  const content = { ...faqContent, items: items.length > 0 ? items : faqContent.items };

  return (
    <>
      <h1 className="sr-only">Questions</h1>
      <Faq content={content} />
    </>
  );
}

import { notFound } from 'next/navigation';

import { JournalForm } from '@/components/admin/journal-form';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'Edit Entry — Admin', path: '/admin/journal', noIndex: true });
export const dynamic = 'force-dynamic';

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.journalPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Journal</p>
      <h1 className="display mt-3 text-d3">{post.title}</h1>
      <p className="mt-2 text-caption text-muted-foreground">/{post.slug}</p>
      <div className="mt-10">
        <JournalForm
          postId={post.id}
          defaultValues={{
            title: post.title,
            excerpt: post.excerpt,
            content: post.contentMdx,
            tags: post.tags.join(', '),
            isPublished: post.isPublished,
          }}
        />
      </div>
    </div>
  );
}

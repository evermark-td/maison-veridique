import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { TextReveal } from '@/components/motion/text-reveal';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Journal',
  description: 'Atelier notes, collection stories and the quiet record of the house.',
  path: '/journal',
});

export const revalidate = 300;

export default async function JournalPage() {
  const posts = await prisma.journalPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      readingMinutes: true,
    },
  });

  return (
    <div className="container-page py-16 lg:py-24">
      <p className="label-micro">Journal</p>
      <TextReveal
        as="h1"
        immediate
        delay={0.1}
        lines={['The quiet record', 'of the house.']}
        className="display mt-5 text-d2"
      />

      {posts.length === 0 ? (
        <FadeIn immediate delay={0.25}>
          <p className="mt-8 max-w-xl text-lead text-muted-foreground">
            The first entries are being written — notes from the cutting table, the mills we
            visit, and the pieces that take a season to make. Subscribe below and the journal
            will reach you as it opens.
          </p>
        </FadeIn>
      ) : (
        <ul className="mt-16 lg:mt-20">
          {posts.map((post, index) => (
            <FadeIn
              as="li"
              key={post.id}
              delay={index * 0.06}
              className="border-t border-border"
            >
              <Link
                href={`/journal/${post.slug}`}
                className="group grid grid-cols-1 gap-x-10 gap-y-2 py-10 lg:grid-cols-12 lg:items-baseline"
              >
                <p className="label-micro lg:col-span-3">
                  {post.publishedAt ? formatDate(post.publishedAt) : ''}
                </p>
                <div className="lg:col-span-7">
                  <h2 className="display text-d3">
                    <span className="relative inline-block">
                      {post.title}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
                    </span>
                  </h2>
                  <p className="mt-3 max-w-xl text-body text-muted-foreground">{post.excerpt}</p>
                </div>
                <p className="label-micro lg:col-span-2 lg:justify-self-end">
                  {post.readingMinutes} min
                </p>
              </Link>
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}

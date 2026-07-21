import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FadeIn } from '@/components/motion/fade-in';
import { TextReveal } from '@/components/motion/text-reveal';
import { JsonLd } from '@/components/seo/json-ld';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/jsonld';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  return prisma.journalPost.findFirst({
    where: { slug, isPublished: true },
    include: { author: { select: { name: true } } },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return buildMetadata({ title: 'Journal', path: '/journal' });
  return buildMetadata({ title: post.title, description: post.excerpt, path: `/journal/${post.slug}` });
}

export default async function JournalPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const paragraphs = post.contentMdx.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const structuredData = [
    articleJsonLd({
      headline: post.title,
      slug: post.slug,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      authorName: post.author?.name ?? null,
    }),
    breadcrumbJsonLd([
      { name: 'Journal', path: '/journal' },
      { name: post.title, path: `/journal/${post.slug}` },
    ]),
  ];

  return (
    <div className="container-page py-16 lg:py-24">
      <JsonLd data={structuredData} />
      <article className="mx-auto max-w-2xl">
        <FadeIn immediate y={0}>
          <p className="label-micro">
            <Link href="/journal" className="transition-colors duration-300 hover:text-foreground">
              Journal
            </Link>
            {post.publishedAt ? (
              <>
                <span aria-hidden className="text-foreground/40"> · </span>
                {formatDate(post.publishedAt)}
              </>
            ) : null}
            <span aria-hidden className="text-foreground/40"> · </span>
            {post.readingMinutes} min
          </p>
        </FadeIn>

        <TextReveal as="h1" immediate delay={0.1} lines={[post.title]} className="display mt-5 text-d2 [text-wrap:balance]" />

        <FadeIn immediate delay={0.2}>
          <p className="mt-6 text-lead text-muted-foreground">{post.excerpt}</p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="mt-10 space-y-6 border-t border-border pt-10">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-body text-foreground/85">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>

        {post.tags.length > 0 ? (
          <FadeIn delay={0.1}>
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
              {post.tags.map((tag) => (
                <li key={tag} className="border border-border px-3 py-1 label-micro">
                  {tag}
                </li>
              ))}
            </ul>
          </FadeIn>
        ) : null}

        {post.author?.name ? (
          <p className="mt-8 text-caption text-muted-foreground">Written by {post.author.name}</p>
        ) : null}
      </article>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FadeIn } from '@/components/motion/fade-in';
import { LEGAL_DOCS } from '@/config/legal';
import { buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];
  if (!doc) return buildMetadata({ title: 'Legal', path: '/legal' });
  return buildMetadata({ title: doc.title, description: doc.intro, path: `/legal/${slug}` });
}

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((slug) => ({ slug }));
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];
  if (!doc) notFound();

  return (
    <div className="container-page py-16 lg:py-24">
      <article className="mx-auto max-w-2xl">
        <p className="label-micro">Legal</p>
        <h1 className="mt-4 display text-d2">{doc.title}</h1>
        <p className="mt-6 text-lead text-muted-foreground">{doc.intro}</p>

        {doc.sections.map((section) => (
          <FadeIn key={section.heading}>
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="display text-d4">{section.heading}</h2>
              <p className="mt-3 text-body text-foreground/80">{section.body}</p>
            </section>
          </FadeIn>
        ))}

        <p className="mt-14 border-t border-border pt-6 text-caption text-muted-foreground">
          This page is a working draft and will be finalised with counsel before launch.
        </p>
      </article>
    </div>
  );
}

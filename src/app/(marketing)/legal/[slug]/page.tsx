import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FadeIn } from '@/components/motion/fade-in';
import { buildMetadata } from '@/lib/seo';

type LegalDoc = { title: string; intro: string; sections: { heading: string; body: string }[] };

/**
 * Placeholder legal copy — structurally complete so the routes are real, to be
 * replaced by counsel-reviewed text before launch.
 */
const LEGAL_DOCS: Record<string, LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'How Maison Véridique collects, uses and protects the personal information of clients and visitors.',
    sections: [
      {
        heading: 'What we collect',
        body: 'Account details you provide (name, email), enquiry and order information, and newsletter subscriptions. We do not sell personal data.',
      },
      {
        heading: 'How it is used',
        body: 'To respond to enquiries, fulfil orders, manage appointments and — with your consent — send the house newsletter. You may unsubscribe at any time.',
      },
      {
        heading: 'Your rights',
        body: 'You may request a copy of your data, its correction, or its deletion by writing to clients@maisonveridique.com.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'The terms governing use of this site and purchases from Maison Véridique.',
    sections: [
      {
        heading: 'Orders',
        body: 'All orders are subject to acceptance and availability. Prices are shown inclusive of applicable taxes unless stated otherwise.',
      },
      {
        heading: 'Bespoke commissions',
        body: 'Commissions are confirmed at the first fitting with a written quotation. Being cut to a single body, they are non-refundable once cutting begins.',
      },
      {
        heading: 'Intellectual property',
        body: 'All content on this site — imagery, text and design — belongs to the house and may not be reproduced without permission.',
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro: 'What this site stores in your browser, and why.',
    sections: [
      {
        heading: 'Essential cookies',
        body: 'A session cookie keeps you signed in to your account. It is set only when you sign in and removed when you sign out.',
      },
      {
        heading: 'No tracking',
        body: 'The house does not run third-party advertising or cross-site tracking cookies.',
      },
    ],
  },
  'shipping-returns': {
    title: 'Shipping & Returns',
    intro: 'Insured, duty-paid delivery to 68 countries — and an honest returns policy.',
    sections: [
      {
        heading: 'Shipping',
        body: 'Orders above €1,000 travel without shipping charge. All shipments are insured and duty-paid; delivery estimates are confirmed at order.',
      },
      {
        heading: 'Returns',
        body: 'Ready-to-wear may be returned unworn within 30 days of delivery for a full refund. Bespoke commissions, being cut to a single body, are final.',
      },
      {
        heading: 'Repairs',
        body: 'Every ready-to-wear piece carries lifetime alterations. Contact client services to arrange a return to the atelier.',
      },
    ],
  },
};

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
        <h1 className="display mt-4 text-d2">{doc.title}</h1>
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

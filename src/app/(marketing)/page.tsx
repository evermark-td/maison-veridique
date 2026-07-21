import { Contact } from '@/components/sections/contact';
import { Faq } from '@/components/sections/faq';
import { Features } from '@/components/sections/features';
import { Hero } from '@/components/sections/hero';
import { Portfolio } from '@/components/sections/portfolio';
import { Pricing } from '@/components/sections/pricing';
import { Services } from '@/components/sections/services';
import { Testimonials } from '@/components/sections/testimonials';
import { portfolioContent } from '@/config/collections';
import { contactContent } from '@/config/contact';
import { faqContent } from '@/config/faq';
import { featuresContent } from '@/config/features';
import { heroContent } from '@/config/home';
import { pricingContent } from '@/config/pricing';
import { servicesContent } from '@/config/services';
import { pressContent } from '@/config/testimonials';
import { getHomeCollections } from '@/lib/queries/catalogue';
import { prisma } from '@/lib/prisma';

// Revalidated on-demand by the admin actions; time-based as a safety net.
export const revalidate = 300;

/**
 * Home — Hero → Features → Services → Portfolio (live from the catalogue) →
 * Testimonials/Press → Pricing → FAQ → Contact.
 */
export default async function HomePage() {
  const [collections, dbFaqs, dbTestimonials] = await Promise.all([
    getHomeCollections(),
    prisma.faqItem.findMany({
      where: { isPublished: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      select: { id: true, question: true, answer: true, category: true },
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      take: 4,
      select: { id: true, quoteText: true, authorName: true, authorTitle: true },
    }),
  ]);

  // Prefer managed content; fall back to editorial defaults when a table is empty.
  const faq = { ...faqContent, items: dbFaqs.length > 0 ? dbFaqs : faqContent.items };
  const press = {
    ...pressContent,
    testimonials:
      dbTestimonials.length > 0
        ? dbTestimonials.map((t) => ({
            id: t.id,
            quote: t.quoteText,
            author: t.authorName,
            role: t.authorTitle ?? '',
          }))
        : pressContent.testimonials,
  };

  const portfolioCollections = collections.map((collection) => {
    const lead = collection.products[0]?.images[0];
    return {
      slug: collection.slug,
      title: collection.title,
      season: collection.season,
      year: collection.year,
      description: collection.description,
      pieceCount: collection._count.products,
      image: lead
        ? {
            src: lead.media.url,
            alt: lead.alt,
            blurDataURL: lead.media.blurDataUrl ?? undefined,
          }
        : null,
    };
  });

  return (
    <>
      <Hero {...heroContent} />
      <Features content={featuresContent} />
      <Services content={servicesContent} />
      {/* Portfolio renders only once the house has published a collection. */}
      <Portfolio content={portfolioContent} collections={portfolioCollections} />
      <Testimonials content={press} />
      <Pricing content={pricingContent} />
      <Faq content={faq} />
      <Contact content={contactContent} />
    </>
  );
}

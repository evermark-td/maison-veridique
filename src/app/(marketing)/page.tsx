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

/**
 * Home — the complete Phase 3 homepage:
 * Navbar (layout) → Hero → Features → Services → Portfolio →
 * Testimonials/Press → Pricing → FAQ → Contact → Footer (layout).
 */
export default function HomePage() {
  return (
    <>
      <Hero {...heroContent} />
      <Features content={featuresContent} />
      <Services content={servicesContent} />
      <Portfolio content={portfolioContent} />
      <Testimonials content={pressContent} />
      <Pricing content={pricingContent} />
      <Faq content={faqContent} />
      <Contact content={contactContent} />
    </>
  );
}

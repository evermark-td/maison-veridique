import { FadeIn } from '@/components/motion/fade-in';
import { SectionHeading } from '@/components/sections/section-heading';
import { ServiceCard } from '@/components/sections/service-card';
import type { ServicesContent } from '@/config/services';

export function Services({ content }: { content: ServicesContent }) {
  const { eyebrow, headingLines, intro, services } = content;

  return (
    <section aria-labelledby="services-heading" className="border-t border-border bg-background">
      <div className="container-page py-24 lg:py-36">
        <div className="grid grid-cols-1 items-end gap-x-16 gap-y-8 lg:grid-cols-12">
          <SectionHeading
            eyebrow={eyebrow}
            lines={headingLines}
            className="lg:col-span-7"
            headingClassName="text-d2"
          />
          <span id="services-heading" className="sr-only">
            {headingLines.join(' ')}
          </span>

          <FadeIn className="lg:col-span-5 lg:pb-3" delay={0.1}>
            <p className="max-w-md text-body text-muted-foreground lg:ml-auto">{intro}</p>
          </FadeIn>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-24 lg:gap-x-12 lg:gap-y-24">
          {services.map((service, index) => (
            <ServiceCard
              key={service.slug}
              service={service}
              delay={(index % 2) * 0.08}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

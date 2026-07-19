import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { SectionHeading } from '@/components/sections/section-heading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { FaqContent, FaqEntry } from '@/config/faq';

function CategoryColumn({
  categories,
  items,
  delay = 0,
}: {
  categories: string[];
  items: FaqEntry[];
  delay?: number;
}) {
  return (
    <div className="space-y-12">
      {categories.map((category, index) => {
        const categoryItems = items.filter((item) => item.category === category);

        return (
          <FadeIn key={category} delay={delay + index * 0.06}>
            <p className="label-micro">{category}</p>
            <Accordion type="multiple" className="mt-2">
              {categoryItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        );
      })}
    </div>
  );
}

export function Faq({ content }: { content: FaqContent }) {
  const { eyebrow, headingLines, intro, items, cta } = content;

  const categories = Array.from(new Set(items.map((item) => item.category)));
  const mid = Math.ceil(categories.length / 2);
  const leftCategories = categories.slice(0, mid);
  const rightCategories = categories.slice(mid);

  return (
    <section aria-labelledby="faq-heading" className="border-t border-border bg-background">
      <div className="container-page py-24 lg:py-36">
        <div className="grid grid-cols-1 items-end gap-x-16 gap-y-8 lg:grid-cols-12">
          <SectionHeading
            eyebrow={eyebrow}
            lines={headingLines}
            className="lg:col-span-6"
            headingClassName="text-d2"
          />
          <span id="faq-heading" className="sr-only">
            {headingLines.join(' ')}
          </span>

          <div className="lg:col-span-6 lg:pb-3">
            <FadeIn delay={0.1}>
              <p className="max-w-md text-body text-muted-foreground lg:ml-auto">{intro}</p>
            </FadeIn>
            <FadeIn delay={0.16}>
              <Link
                href={cta.href}
                className="group mt-6 inline-flex items-center gap-3 text-micro font-medium uppercase tracking-[0.16em] lg:ml-auto lg:flex lg:w-fit"
              >
                <span className="relative">
                  {cta.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:origin-right group-hover:scale-x-0" />
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            </FadeIn>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 lg:mt-24 lg:grid-cols-2">
          <CategoryColumn categories={leftCategories} items={items} />
          <CategoryColumn categories={rightCategories} items={items} delay={0.1} />
        </div>
      </div>
    </section>
  );
}

import { FadeIn } from '@/components/motion/fade-in';
import { Marquee } from '@/components/motion/marquee';
import { TextReveal } from '@/components/motion/text-reveal';
import { SectionHeading } from '@/components/sections/section-heading';
import type { PressContent, Testimonial } from '@/config/testimonials';

function Attribution({ author, role, outlet }: Testimonial) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption font-medium text-foreground">{author}</span>
      <span className="label-micro normal-case tracking-[0.16em]">
        {outlet ? `${role}, ${outlet}` : role}
      </span>
    </div>
  );
}

export function Testimonials({ content }: { content: PressContent }) {
  const { eyebrow, headingLines, featured, testimonials, pressOutlets } = content;

  return (
    <section
      aria-labelledby="press-heading"
      className="border-t border-border bg-noir text-paper"
    >
      <div className="container-page py-24 lg:py-36">
        <SectionHeading
          eyebrow={eyebrow}
          lines={headingLines}
          className="[&_.label-micro]:text-paper/50"
          headingClassName="text-d2 text-paper"
        />
        <span id="press-heading" className="sr-only">
          {headingLines.join(' ')}
        </span>

        {/* Featured pull-quote */}
        <figure className="mx-auto mt-16 max-w-4xl text-center lg:mt-24">
          <TextReveal
            as="p"
            lines={[<span key="q">&ldquo;{featured.quote}&rdquo;</span>]}
            className="display text-d3 text-paper [text-wrap:balance]"
          />
          <FadeIn delay={0.15}>
            <figcaption className="mt-8 flex flex-col items-center gap-1">
              <span className="text-caption font-medium text-paper">{featured.author}</span>
              <span className="label-micro text-paper/50">
                {featured.role}
                {featured.outlet ? ` · ${featured.outlet}` : ''}
              </span>
            </figcaption>
          </FadeIn>
        </figure>

        {/* Supporting testimonials */}
        <ul className="mt-20 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 lg:mt-28 lg:gap-y-20">
          {testimonials.map((testimonial, index) => (
            <FadeIn
              as="li"
              key={testimonial.id}
              delay={(index % 2) * 0.08}
              className="border-t border-paper/15 pt-8"
            >
              <blockquote className="text-lead text-paper/85">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 [&_.label-micro]:text-paper/55 [&_span:first-child]:text-paper">
                <Attribution {...testimonial} />
              </div>
            </FadeIn>
          ))}
        </ul>
      </div>

      {/* Press marquee */}
      <div className="border-t border-paper/15 py-12 lg:py-16">
        <p className="label-micro container-page mb-8 text-center text-paper/55">
          As seen in
        </p>
        <Marquee items={pressOutlets} itemClassName="text-paper/55" durationSeconds={38} />
      </div>
    </section>
  );
}

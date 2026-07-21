import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { ContactForm } from '@/components/sections/contact-form';
import { TextReveal } from '@/components/motion/text-reveal';
import type { ContactContent } from '@/config/contact';

export function Contact({ content }: { content: ContactContent }) {
  const { eyebrow, headingLines, intro, enquiryTypes, channels, boutiques, hours } = content;

  return (
    <section
      aria-labelledby="contact-heading"
      className="border-t border-border bg-noir text-paper"
    >
      <div className="container-page grid grid-cols-1 gap-x-16 gap-y-16 py-24 lg:grid-cols-12 lg:py-36">
        {/* Left — editorial + house directory */}
        <div className="lg:col-span-5">
          <p className="label-micro text-paper/50">{eyebrow}</p>
          <TextReveal
            as="h2"
            lines={headingLines}
            delay={0.05}
            className="display mt-5 text-d2 text-paper"
          />
          <span id="contact-heading" className="sr-only">
            {headingLines.join(' ')}
          </span>

          <FadeIn delay={0.1}>
            <p className="mt-8 max-w-md text-body text-paper/70">{intro}</p>
          </FadeIn>

          <FadeIn delay={0.16}>
            <dl className="mt-12 space-y-6">
              {channels.map((channel) => (
                <div key={channel.label}>
                  <dt className="label-micro text-paper/55">{channel.label}</dt>
                  <dd className="mt-1.5">
                    <Link
                      href={channel.href}
                      className="group inline-flex text-body text-paper transition-colors duration-300 hover:text-paper/70"
                    >
                      <span className="relative">
                        {channel.value}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-paper transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="mt-12 border-t border-paper/15 pt-8">
              <p className="label-micro text-paper/55">Boutiques</p>
              <ul className="mt-4 space-y-4">
                {boutiques.map((boutique) => (
                  <li key={boutique.city} className="text-body text-paper/75">
                    <span className="text-paper">{boutique.city}</span>
                    <span aria-hidden className="text-paper/40"> — </span>
                    {boutique.address}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-caption text-paper/55">{hours}</p>
            </div>
          </FadeIn>
        </div>

        {/* Right — enquiry form */}
        <FadeIn className="lg:col-span-6 lg:col-start-7" delay={0.12}>
          <ContactForm enquiryTypes={enquiryTypes} />
        </FadeIn>
      </div>
    </section>
  );
}

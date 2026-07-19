'use client';

import Image from 'next/image';
import Link from 'next/link';

import { FadeIn } from '@/components/motion/fade-in';
import { TextReveal } from '@/components/motion/text-reveal';
import { getBlur } from '@/config/image-blur';

export type HeroProps = {
  eyebrow?: string;
  titleLines: string[];
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
  /** Optional looping background video; falls back to the image as poster. */
  videoSrc?: string;
};

export function Hero({
  eyebrow = 'Autumn–Winter 26',
  titleLines,
  intro,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  videoSrc,
}: HeroProps) {
  return (
    <section
      aria-label="Featured collection"
      className="relative h-[100svh] min-h-[40rem] w-full overflow-hidden bg-noir text-paper"
    >
      {/* Media layer — static; no scroll-linked transform (avoids per-image GPU
          layers ghosting during scroll). */}
      <div className="absolute inset-0">
        {videoSrc ? (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={imageSrc}
            aria-hidden
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            {...(getBlur(imageSrc)
              ? { placeholder: 'blur' as const, blurDataURL: getBlur(imageSrc) }
              : {})}
          />
        )}
      </div>

      {/* Legibility scrims — top for the overlay navbar, bottom for the copy */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-noir/55 via-noir/20 to-noir/70"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-noir/80 to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="container-page pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-4xl">
            <FadeIn immediate y={0} duration={0.9} delay={0.15}>
              <p className="label-micro text-paper/70">{eyebrow}</p>
            </FadeIn>

            <TextReveal
              as="h1"
              immediate
              delay={0.28}
              lines={titleLines}
              className="display mt-5 text-d1 text-paper"
              lineClassName="[text-wrap:balance]"
            />

            <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
              <FadeIn immediate delay={0.7} duration={0.9}>
                <p className="max-w-md text-lead text-paper/80">{intro}</p>
              </FadeIn>

              <FadeIn immediate delay={0.85} duration={0.9}>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link href={primaryCta.href} className="hero-cta group">
                    <span className="relative overflow-hidden">
                      <span className="block transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:-translate-y-full">
                        {primaryCta.label}
                      </span>
                      <span className="absolute inset-0 block translate-y-full transition-transform duration-500 [transition-timing-function:var(--ease-luxe)] group-hover:translate-y-0">
                        {primaryCta.label}
                      </span>
                    </span>
                    <span className="hero-cta-rule" />
                  </Link>

                  {secondaryCta ? (
                    <Link
                      href={secondaryCta.href}
                      className="text-micro font-medium uppercase tracking-[0.16em] text-paper/70 transition-colors duration-300 hover:text-paper"
                    >
                      {secondaryCta.label}
                    </Link>
                  ) : null}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import type { HeroProps } from '@/components/sections/hero';

/**
 * Editorial content for the home page. Sourced from SiteSetting in Phase 4;
 * kept here as typed defaults so sections stay data-driven from the start.
 */
export const heroContent: HeroProps = {
  eyebrow: 'Autumn–Winter 26 — The Quiet Hour',
  titleLines: ['A wardrobe', 'built to', 'outlast the season.'],
  intro:
    'Rare cloths, cut by hand in our Paris atelier and released twice a year. Nothing hurried, nothing disposable.',
  primaryCta: { label: 'Discover the collection', href: '/collections/autumn-winter-26' },
  secondaryCta: { label: 'Book a private viewing', href: '/appointments' },
  imageSrc: '/images/hero-quiet-hour.jpg',
  imageAlt: 'A model fastening a dark tailored jacket on a staircase',
};

export type CollectionEntry = {
  slug: string;
  season: string;
  year: string;
  title: string;
  description: string;
  pieceCount: number;
  image: { src: string; alt: string };
};

export type PortfolioContent = {
  eyebrow: string;
  headingLines: string[];
  intro: string;
  cta: { label: string; href: string };
  featured: CollectionEntry;
  collections: CollectionEntry[];
};

/**
 * The collections showcase — the house "portfolio". Sourced from the
 * Collection table in Phase 4; typed defaults keep the section data-driven.
 */
export const portfolioContent: PortfolioContent = {
  eyebrow: 'The Collections',
  headingLines: ['Two seasons.', 'A lifetime of wear.'],
  intro:
    'Each collection is a closed edition — cut in limited lengths, never restocked. What follows is the current season, and the archive that shaped it.',
  cta: { label: 'View all collections', href: '/collections' },
  featured: {
    slug: 'autumn-winter-26',
    season: 'Autumn–Winter',
    year: '26',
    title: 'The Quiet Hour',
    description:
      'Heavyweight cashmere, storm-grey wool and a palette drawn from Parisian winter light. The house at its most considered.',
    pieceCount: 42,
    image: {
      src: '/images/collection-aw26.jpg',
      alt: 'Model in an olive utility jacket over knitwear',
    },
  },
  collections: [
    {
      slug: 'spring-summer-26',
      season: 'Spring–Summer',
      year: '26',
      title: 'Salt & Light',
      description: 'Raw silk, bleached linen and a coastal ease.',
      pieceCount: 38,
      image: {
        src: '/images/collection-ss26.jpg',
        alt: 'Model in a pale linen ensemble in bright natural light',
      },
    },
    {
      slug: 'autumn-winter-25',
      season: 'Autumn–Winter',
      year: '25',
      title: 'The Long Field',
      description: 'Tweed, waxed cotton and the weight of the countryside.',
      pieceCount: 40,
      image: {
        src: '/images/collection-aw25.jpg',
        alt: 'A heavy workwear jacket photographed against a dark ground',
      },
    },
    {
      slug: 'rare-cloths',
      season: 'The Archive',
      year: '—',
      title: 'Rare Cloths',
      description: 'Single-length weaves recovered from the house vault.',
      pieceCount: 16,
      image: {
        src: '/images/service-styling.jpg',
        alt: 'Rare tailored garments arranged on a rail in a showroom',
      },
    },
  ],
};

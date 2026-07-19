export type FeaturePillar = {
  index: string;
  title: string;
  description: string;
};

export type FeaturesContent = {
  eyebrow: string;
  headingLines: string[];
  intro: string;
  cta: { label: string; href: string };
  image: { src: string; alt: string };
  pillars: FeaturePillar[];
};

/**
 * The Atelier / craft story. Sourced from SiteSetting in Phase 4.
 */
export const featuresContent: FeaturesContent = {
  eyebrow: 'The Atelier',
  headingLines: ['Made slowly,', 'by hand,', 'to be kept.'],
  intro:
    'Every Maison Véridique garment begins as a single paper pattern and a length of rare cloth. What follows is measured in days, not minutes — cut, canvassed and finished by the same hands from first stitch to last.',
  cta: { label: 'Inside the atelier', href: '/atelier' },
  image: {
    src: '/images/atelier-handwork.jpg',
    alt: 'Knitwear and coats on a rail in the atelier, in natural light',
  },
  pillars: [
    {
      index: '01',
      title: 'Rare & considered cloth',
      description:
        'Woven in limited lengths by mills we have worked with for a generation — cashmere, virgin wool and raw silk, chosen for how they age.',
    },
    {
      index: '02',
      title: 'Cut by a single hand',
      description:
        'One cutter drafts, one tailor makes. No garment passes through an assembly line; each carries the mark of the person who built it.',
    },
    {
      index: '03',
      title: 'Finished to last decades',
      description:
        'Full canvas construction, hand-felled seams and buttonholes worked in silk — details you feel long before you see them.',
    },
    {
      index: '04',
      title: 'Two collections a year',
      description:
        'We release only in spring and autumn. Nothing is designed to expire; every piece is meant to return, season after season.',
    },
  ],
};

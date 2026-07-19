export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  outlet?: string;
};

export type PressContent = {
  eyebrow: string;
  headingLines: string[];
  featured: Testimonial;
  testimonials: Testimonial[];
  pressOutlets: string[];
};

/**
 * Press and client proof. Sourced from the Testimonial / PressMention tables
 * in Phase 4; typed defaults keep the section data-driven from the start.
 */
export const pressContent: PressContent = {
  eyebrow: 'In the Press',
  headingLines: ['What is said,', 'quietly.'],
  featured: {
    id: 'vogue-feature',
    quote:
      'The finest tailoring to come out of Paris in a decade — a house that has decided, against the current, that clothes should last.',
    author: 'Amélie Rousseau',
    role: 'Fashion Director',
    outlet: 'Vogue Paris',
  },
  testimonials: [
    {
      id: 't-bof',
      quote:
        'Véridique has built something rare: a luxury brand that measures itself in years of wear, not seasons of hype.',
      author: 'Imran Ali',
      role: 'Senior Correspondent',
      outlet: 'The Business of Fashion',
    },
    {
      id: 't-ft',
      quote:
        'You feel the construction before you see it. Few houses at any price still work this way.',
      author: 'Charlotte Nkemi',
      role: 'Style Editor',
      outlet: 'Financial Times — HTSI',
    },
    {
      id: 't-client',
      quote:
        'My coat is nine years old and has been back to the atelier twice. It looks better than the day I bought it.',
      author: 'Sofia Marchetti',
      role: 'House Client since 2017',
    },
    {
      id: 't-another',
      quote:
        'Restraint as a design language. The most quietly confident collection of the season.',
      author: 'Theo Lindqvist',
      role: 'Editor-at-Large',
      outlet: 'AnOther Magazine',
    },
  ],
  pressOutlets: [
    'VOGUE',
    'Financial Times',
    'The Business of Fashion',
    'AnOther',
    'SYSTEM',
    'Monocle',
    'WWD',
    'Le Figaro',
  ],
};

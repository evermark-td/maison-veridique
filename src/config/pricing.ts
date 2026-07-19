export type PricingTier = {
  slug: string;
  name: string;
  tagline: string;
  priceLabel: string;
  features: string[];
  isHighlighted?: boolean;
};

export type PricingContent = {
  eyebrow: string;
  headingLines: string[];
  intro: string;
  tiers: PricingTier[];
  footnote: string;
};

/**
 * The house's client tiers — mirrors the seeded `ServiceTier` table
 * (prisma/seed.ts). Typed defaults here keep the section data-driven until
 * Phase 4 reads it live.
 */
export const pricingContent: PricingContent = {
  eyebrow: 'Appointments',
  headingLines: ['Three ways', 'to be known', 'by the house.'],
  intro:
    'Every tier begins with a conversation, not a transaction. Appointments are offered in Paris, Milan and Tokyo, or by request elsewhere.',
  tiers: [
    {
      slug: 'private-viewing',
      name: 'Private Viewing',
      tagline: 'An hour with the collection, alone.',
      priceLabel: 'By invitation',
      features: [
        'One-to-one appointment in boutique',
        'Full seasonal collection presented',
        'Complimentary alterations',
      ],
    },
    {
      slug: 'atelier-bespoke',
      name: 'Atelier Bespoke',
      tagline: 'A garment drafted to your body alone.',
      priceLabel: 'From €4,800',
      features: [
        'Three fittings with the head cutter',
        'Choice of rare and archive cloths',
        'Individual paper pattern retained by the house',
        'Twelve-week delivery',
      ],
      isHighlighted: true,
    },
    {
      slug: 'house-client',
      name: 'House Client',
      tagline: 'The wardrobe, considered as a whole.',
      priceLabel: 'Annual retainer',
      features: [
        'Dedicated client advisor',
        'Pre-collection access',
        'Seasonal wardrobe review',
        'Lifetime garment care',
      ],
    },
  ],
  footnote: 'Bespoke pricing depends on cloth and construction. Your advisor will confirm a quote at the first fitting.',
};

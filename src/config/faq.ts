export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type FaqContent = {
  eyebrow: string;
  headingLines: string[];
  intro: string;
  items: FaqEntry[];
  cta: { label: string; href: string };
};

/**
 * Client questions, grouped by category. Sourced from the `FaqItem` table in
 * Phase 4 (category + sortOrder fields mirror the schema); typed defaults keep
 * the section data-driven from the start.
 */
export const faqContent: FaqContent = {
  eyebrow: 'Questions',
  headingLines: ['Before you', 'write to us.'],
  intro:
    'The questions our client advisors are asked most. For anything else, the house is always a message away.',
  cta: { label: 'Ask us directly', href: '/contact' },
  items: [
    {
      id: 'appointments-book',
      category: 'Appointments',
      question: 'How do I book a private appointment?',
      answer:
        'Submit an enquiry through the appointments page with your preferred boutique and date. A client advisor confirms within one business day.',
    },
    {
      id: 'appointments-bespoke',
      category: 'Appointments',
      question: 'How long does a bespoke commission take?',
      answer:
        'From first fitting to delivery, typically twelve weeks. Rare or archive cloths in limited supply may extend this — your advisor will confirm at consultation.',
    },
    {
      id: 'shipping-international',
      category: 'Shipping & Returns',
      question: 'Do you ship internationally?',
      answer:
        'Yes — insured, duty-paid delivery to 68 countries. Orders above €1,000 travel without a shipping charge.',
    },
    {
      id: 'shipping-returns',
      category: 'Shipping & Returns',
      question: 'What is your returns policy?',
      answer:
        'Ready-to-wear may be returned unworn within 30 days of delivery. Bespoke commissions, being cut to a single body, are final.',
    },
    {
      id: 'payment-methods',
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer:
        'All major credit cards, and bank transfer for bespoke commissions and House Client invoicing. Boutiques also accept payment in person.',
    },
    {
      id: 'payment-bespoke-pricing',
      category: 'Payment',
      question: 'How is bespoke pricing determined?',
      answer:
        'Price depends on the cloth chosen and the complexity of construction. Your advisor confirms an exact quote at the first fitting, before any commitment.',
    },
    {
      id: 'care-instructions',
      category: 'Care & Repair',
      question: 'How should I care for the garments?',
      answer:
        'Each piece carries its own care card. As a rule: rest a garment 24 hours between wears, brush rather than wash, and return it to the house for repair.',
    },
    {
      id: 'care-repair',
      category: 'Care & Repair',
      question: 'Do you repair garments bought years ago?',
      answer:
        'Always. Every ready-to-wear piece carries lifetime alterations, and the atelier that made your garment can restore it at any point in its life.',
    },
  ],
};

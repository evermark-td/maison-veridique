export type FooterLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: FooterLink[] };

export type FooterContent = {
  newsletter: {
    heading: string;
    description: string;
  };
  columns: FooterColumn[];
  social: FooterLink[];
  legal: FooterLink[];
};

/**
 * Site footer content. Sourced from SiteSetting in Phase 4; typed defaults keep
 * the footer data-driven from the start.
 */
export const footerContent: FooterContent = {
  newsletter: {
    heading: 'The house, in your inbox',
    description:
      'Collection previews, atelier notes and private appointment openings. Twice a month, never more.',
  },
  columns: [
    {
      heading: 'Collections',
      links: [
        { label: 'Autumn–Winter 26', href: '/collections/autumn-winter-26' },
        { label: 'Spring–Summer 26', href: '/collections/spring-summer-26' },
        { label: 'The Archive', href: '/collections/rare-cloths' },
        { label: 'All Collections', href: '/collections' },
      ],
    },
    {
      heading: 'The House',
      links: [
        { label: 'Atelier', href: '/atelier' },
        { label: 'Journal', href: '/journal' },
        { label: 'Boutiques', href: '/boutiques' },
        { label: 'Appointments', href: '/appointments' },
      ],
    },
    {
      heading: 'Services',
      links: [
        { label: 'Bespoke Commission', href: '/services#bespoke' },
        { label: 'Personal Styling', href: '/services#styling' },
        { label: 'Garment Care', href: '/services#care' },
        { label: 'Alterations & Repair', href: '/services#alterations' },
      ],
    },
    {
      heading: 'Client Care',
      links: [
        { label: 'Contact', href: '/contact' },
        { label: 'Shipping & Returns', href: '/legal/shipping-returns' },
        { label: 'Size Guide', href: '/size-guide' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
  legal: [
    { label: 'Privacy', href: '/legal/privacy' },
    { label: 'Terms', href: '/legal/terms' },
    { label: 'Cookies', href: '/legal/cookies' },
  ],
};

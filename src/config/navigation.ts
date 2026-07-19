export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavColumn = {
  heading: string;
  links: NavLink[];
};

export type NavFeature = {
  eyebrow: string;
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type NavItem = {
  label: string;
  href: string;
  columns?: NavColumn[];
  feature?: NavFeature;
};

export const announcements = [
  'Complimentary insured delivery worldwide',
  'Autumn–Winter 26 — now presented in boutique',
  'Private appointments available in Paris, Milan and Tokyo',
] as const;

export const mainNav: NavItem[] = [
  {
    label: 'Collections',
    href: '/collections',
    columns: [
      {
        heading: 'Autumn–Winter 26',
        links: [
          { label: 'The Full Collection', href: '/collections/autumn-winter-26' },
          { label: 'Outerwear', href: '/collections/autumn-winter-26?category=outerwear' },
          { label: 'Tailoring', href: '/collections/autumn-winter-26?category=tailoring' },
          { label: 'Knitwear', href: '/collections/autumn-winter-26?category=knitwear' },
        ],
      },
      {
        heading: 'The Archive',
        links: [
          { label: 'Spring–Summer 26', href: '/collections/spring-summer-26' },
          { label: 'Autumn–Winter 25', href: '/collections/autumn-winter-25' },
          { label: 'Rare Cloths', href: '/collections/rare-cloths' },
          { label: 'All Collections', href: '/collections' },
        ],
      },
      {
        heading: 'Categories',
        links: [
          { label: 'Coats', href: '/collections?category=coats' },
          { label: 'Suiting', href: '/collections?category=suiting' },
          { label: 'Dresses', href: '/collections?category=dresses' },
          { label: 'Leather Goods', href: '/collections?category=leather-goods' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Lookbook',
      title: 'A Winter in Cashmere',
      href: '/lookbook',
      imageSrc: '/images/collection-aw26.jpg',
      imageAlt: 'Model wearing a long cashmere coat against a stone wall',
    },
  },
  {
    label: 'Atelier',
    href: '/atelier',
    columns: [
      {
        heading: 'The House',
        links: [
          { label: 'Our Story', href: '/atelier' },
          { label: 'Craft & Materials', href: '/atelier#craft' },
          { label: 'Sustainability', href: '/atelier#sustainability' },
        ],
      },
      {
        heading: 'Services',
        links: [
          { label: 'Bespoke Commission', href: '/services#bespoke' },
          { label: 'Personal Styling', href: '/services#styling' },
          { label: 'Garment Care & Repair', href: '/services#care' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Inside the Atelier',
      title: 'Fourteen Hands, One Coat',
      href: '/journal',
      imageSrc: '/images/atelier-tailor.jpg',
      imageAlt: 'Rails of garments in the atelier',
    },
  },
  { label: 'Journal', href: '/journal' },
  { label: 'Boutiques', href: '/boutiques' },
  { label: 'Appointments', href: '/appointments' },
];

export const utilityNav: NavLink[] = [
  { label: 'Client Services', href: '/contact' },
  { label: 'Shipping & Returns', href: '/legal/shipping-returns' },
  { label: 'Sign In', href: '/auth/sign-in' },
];

export type ServiceEntry = {
  slug: string;
  index: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
};

export type ServicesContent = {
  eyebrow: string;
  headingLines: string[];
  intro: string;
  services: ServiceEntry[];
};

/**
 * The house services. Sourced from the ServiceTier / SiteSetting layer in
 * Phase 4; typed defaults keep the section data-driven from the start.
 */
export const servicesContent: ServicesContent = {
  eyebrow: 'Services',
  headingLines: ['Beyond the', 'garment.'],
  intro:
    'The relationship does not end at purchase. Four services, offered in every boutique, keep a Maison Véridique wardrobe personal and lasting.',
  services: [
    {
      slug: 'bespoke',
      index: '01',
      title: 'Bespoke Commission',
      description:
        'A garment drafted to your measurements alone, across three fittings with the head cutter and your choice of archive cloth.',
      href: '/services#bespoke',
      image: {
        src: '/images/service-bespoke.jpg',
        alt: 'Head cutter pinning a bespoke jacket on a client during a fitting',
      },
    },
    {
      slug: 'styling',
      index: '02',
      title: 'Personal Styling',
      description:
        'A dedicated advisor who learns your wardrobe and edits each collection to it — by appointment, in boutique or at home.',
      href: '/services#styling',
      image: {
        src: '/images/service-styling.jpg',
        alt: 'Stylist arranging tailored garments on a rail in a bright showroom',
      },
    },
    {
      slug: 'care',
      index: '03',
      title: 'Garment Care',
      description:
        'Cleaning, pressing and re-proofing carried out by the atelier that made the piece — so it is restored, never merely serviced.',
      href: '/services#care',
      image: {
        src: '/images/service-care.jpg',
        alt: 'A cream knitted garment hanging, cared for by the house',
      },
    },
    {
      slug: 'alterations',
      index: '04',
      title: 'Alterations & Repair',
      description:
        'Lifetime alterations on every ready-to-wear piece, and invisible repair when a favourite has earned its years.',
      href: '/services#alterations',
      image: {
        src: '/images/service-alterations.jpg',
        alt: 'A tailored camel overcoat worn open, showing the line of the cut',
      },
    },
  ],
};

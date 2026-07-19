import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Veridique!2026', 12);

  await prisma.user.upsert({
    where: { email: 'admin@maisonveridique.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@maisonveridique.com',
      name: 'House Administrator',
      role: 'ADMIN',
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const tiers = [
    {
      slug: 'private-viewing',
      name: 'Private Viewing',
      tagline: 'An hour with the collection, alone.',
      priceLabel: 'By invitation',
      features: [
        'One-to-one appointment in-boutique',
        'Full seasonal collection presented',
        'Complimentary alterations',
      ],
      sortOrder: 0,
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
      sortOrder: 1,
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
      sortOrder: 2,
    },
  ];

  for (const tier of tiers) {
    await prisma.serviceTier.upsert({
      where: { slug: tier.slug },
      update: tier,
      create: tier,
    });
  }

  const faqs = [
    {
      question: 'How do I book a private appointment?',
      answer:
        'Submit an enquiry through the appointments page. A client advisor responds within one business day to confirm the boutique, date and hour.',
      category: 'Appointments',
      sortOrder: 0,
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Yes. The house ships to 68 countries with insured, duty-paid delivery. Orders above €1,000 travel without shipping charge.',
      category: 'Shipping',
      sortOrder: 1,
    },
    {
      question: 'What is your returns policy?',
      answer:
        'Ready-to-wear may be returned unworn within 30 days. Bespoke commissions, being cut to a single body, are final.',
      category: 'Returns',
      sortOrder: 2,
    },
    {
      question: 'How should I care for the garments?',
      answer:
        'Each piece carries its own care card. As a rule: rest a garment 24 hours between wears, brush rather than wash, and return it to the house for repair.',
      category: 'Care',
      sortOrder: 3,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (existing) {
      await prisma.faqItem.update({ where: { id: existing.id }, data: faq });
    } else {
      await prisma.faqItem.create({ data: faq });
    }
  }

  const boutiques = [
    {
      slug: 'paris-saint-honore',
      name: 'Paris — Saint-Honoré',
      address: '212 Rue Saint-Honoré',
      city: 'Paris',
      country: 'France',
      lat: 48.8656,
      lng: 2.3324,
      phone: '+33 1 42 60 00 00',
    },
    {
      slug: 'milan-montenapoleone',
      name: 'Milan — Montenapoleone',
      address: 'Via Monte Napoleone 8',
      city: 'Milan',
      country: 'Italy',
      lat: 45.4685,
      lng: 9.1954,
      phone: '+39 02 7600 0000',
    },
    {
      slug: 'tokyo-aoyama',
      name: 'Tokyo — Aoyama',
      address: '5-2-1 Minami-Aoyama, Minato-ku',
      city: 'Tokyo',
      country: 'Japan',
      lat: 35.6636,
      lng: 139.7128,
      phone: '+81 3 6427 0000',
    },
  ];

  for (const boutique of boutiques) {
    await prisma.boutique.upsert({
      where: { slug: boutique.slug },
      update: boutique,
      create: boutique,
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

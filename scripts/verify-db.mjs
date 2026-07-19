/**
 * Verifies the live database: table count, seeded rows, and that the admin
 * password hash actually validates. Run: node scripts/verify-db.mjs
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({ log: ['error'] });

const tables = await prisma.$queryRaw`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  ORDER BY table_name;
`;

const counts = {
  User: await prisma.user.count(),
  ServiceTier: await prisma.serviceTier.count(),
  FaqItem: await prisma.faqItem.count(),
  Boutique: await prisma.boutique.count(),
  Collection: await prisma.collection.count(),
  Product: await prisma.product.count(),
  Enquiry: await prisma.enquiry.count(),
  Subscriber: await prisma.subscriber.count(),
};

const admin = await prisma.user.findUnique({
  where: { email: 'admin@maisonveridique.com' },
  select: { email: true, role: true, passwordHash: true },
});

const pwOk = admin?.passwordHash
  ? await bcrypt.compare('Veridique!2026', admin.passwordHash)
  : false;

console.log(`Tables created: ${tables.length}`);
console.log(tables.map((t) => t.table_name).join(', '));
console.log('\nRow counts:');
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(14)} ${v}`);
console.log(`\nAdmin: ${admin?.email ?? 'MISSING'} role=${admin?.role ?? '-'}`);
console.log(`Admin password verifies: ${pwOk}`);

await prisma.$disconnect();

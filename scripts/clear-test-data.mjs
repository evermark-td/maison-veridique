/**
 * Removes rows created by manual end-to-end testing (example.com addresses).
 * Run: node scripts/clear-test-data.mjs
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['error'] });

const subs = await prisma.subscriber.deleteMany({ where: { email: { contains: '@example.com' } } });
const enq = await prisma.enquiry.deleteMany({ where: { email: { contains: '@example.com' } } });
const users = await prisma.user.deleteMany({ where: { email: { contains: '@example.com' } } });

console.log(
  `Deleted ${subs.count} test subscriber(s), ${enq.count} test enquiry(ies), ${users.count} test user(s).`,
);

await prisma.$disconnect();

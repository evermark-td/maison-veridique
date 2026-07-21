import { AddressBook } from '@/components/account/address-book';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'Addresses', path: '/account/addresses', noIndex: true });

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const user = await getCurrentUser();

  const addresses = await prisma.address.findMany({
    where: { userId: user!.id },
    orderBy: { id: 'desc' },
  });

  return <AddressBook addresses={addresses} />;
}

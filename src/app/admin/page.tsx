import Link from 'next/link';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({ title: 'Admin', path: '/admin', noIndex: true });

// Live counts on every load — an admin dashboard must never serve stale data.
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  const [newEnquiries, totalEnquiries, confirmedSubscribers, customers] = await Promise.all([
    prisma.enquiry.count({ where: { status: 'NEW' } }),
    prisma.enquiry.count(),
    prisma.subscriber.count({ where: { confirmedAt: { not: null }, unsubscribedAt: null } }),
    prisma.user.count({ where: { role: 'USER' } }),
  ]);

  const stats = [
    { label: 'New enquiries', value: newEnquiries, href: '/admin/enquiries' },
    { label: 'Total enquiries', value: totalEnquiries, href: '/admin/enquiries' },
    { label: 'Confirmed subscribers', value: confirmedSubscribers },
    { label: 'Customer accounts', value: customers },
  ];

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Dashboard</p>
      <h1 className="display mt-3 text-d3">
        {user?.name ? `Good day, ${user.name.split(' ')[0]}.` : 'The house, at a glance.'}
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
        {stats.map((stat) => {
          const inner = (
            <>
              <span className="display text-d2 leading-none">{stat.value}</span>
              <span className="label-micro">{stat.label}</span>
            </>
          );

          return stat.href ? (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex flex-col gap-4 bg-background p-8 transition-colors duration-300 hover:bg-bone/40"
            >
              {inner}
            </Link>
          ) : (
            <div key={stat.label} className="flex flex-col gap-4 bg-background p-8">
              {inner}
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-caption text-muted-foreground">
        The enquiry inbox and content management arrive in the next build steps.
      </p>
    </div>
  );
}

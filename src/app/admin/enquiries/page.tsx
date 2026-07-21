import type { EnquiryStatus } from '@prisma/client';
import Link from 'next/link';

import { EnquiryStatusControl } from '@/components/admin/enquiry-status-control';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDate } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Enquiries — Admin',
  path: '/admin/enquiries',
  noIndex: true,
});

export const dynamic = 'force-dynamic';

const FILTERS: { label: string; value?: EnquiryStatus }[] = [
  { label: 'All' },
  { label: 'New', value: 'NEW' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Closed', value: 'CLOSED' },
];

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  NEW: 'bg-foreground text-background',
  IN_PROGRESS: 'bg-bone text-foreground',
  CLOSED: 'bg-transparent text-muted-foreground border border-border',
};

const TYPE_LABELS: Record<string, string> = {
  APPOINTMENT: 'Appointment',
  BESPOKE: 'Bespoke',
  PRESS: 'Press',
  GENERAL: 'General',
};

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const active = FILTERS.find((f) => f.value === params.status)?.value;

  const [enquiries, counts] = await Promise.all([
    prisma.enquiry.findMany({
      where: active ? { status: active } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        handledBy: { select: { name: true } },
        boutique: { select: { city: true } },
      },
    }),
    prisma.enquiry.groupBy({ by: ['status'], _count: true }),
  ]);

  const countFor = (status?: EnquiryStatus) =>
    status
      ? (counts.find((c) => c.status === status)?._count ?? 0)
      : counts.reduce((sum, c) => sum + c._count, 0);

  return (
    <div className="container-page py-12 lg:py-16">
      <p className="label-micro">Enquiries</p>
      <h1 className="display mt-3 text-d3">The inbox.</h1>

      {/* Status filters */}
      <nav aria-label="Filter enquiries" className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-b border-border pb-4">
        {FILTERS.map((filter) => {
          const isActive = filter.value === active;
          return (
            <Link
              key={filter.label}
              href={filter.value ? `/admin/enquiries?status=${filter.value}` : '/admin/enquiries'}
              className={cn(
                'text-micro font-medium tracking-[0.16em] uppercase transition-colors duration-300',
                isActive ? 'text-foreground' : 'text-foreground/60 hover:text-foreground',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {filter.label}
              <span className="ml-1.5 text-foreground/60">{countFor(filter.value)}</span>
            </Link>
          );
        })}
      </nav>

      {enquiries.length === 0 ? (
        <p className="mt-12 max-w-md text-body text-muted-foreground">
          Nothing here. When a client writes through the contact page, their enquiry arrives in
          this inbox.
        </p>
      ) : (
        <ul>
          {enquiries.map((enquiry) => (
            <li
              key={enquiry.id}
              className="grid grid-cols-1 gap-x-10 gap-y-4 border-b border-border py-8 lg:grid-cols-12"
            >
              {/* Who */}
              <div className="lg:col-span-3">
                <p className="text-body font-medium text-foreground">{enquiry.fullName}</p>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="mt-1 block text-caption text-muted-foreground hover:text-foreground"
                >
                  {enquiry.email}
                </a>
                {enquiry.phone ? (
                  <p className="mt-0.5 text-caption text-muted-foreground">{enquiry.phone}</p>
                ) : null}
              </div>

              {/* What */}
              <div className="lg:col-span-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span
                    className={cn(
                      'inline-flex px-2.5 py-1 text-micro font-medium tracking-[0.16em] uppercase',
                      STATUS_STYLES[enquiry.status],
                    )}
                  >
                    {enquiry.status.replace('_', ' ')}
                  </span>
                  <span className="label-micro">{TYPE_LABELS[enquiry.type] ?? enquiry.type}</span>
                  {enquiry.boutique ? (
                    <span className="label-micro">· {enquiry.boutique.city}</span>
                  ) : null}
                  <span className="label-micro">· {formatDate(enquiry.createdAt)}</span>
                </div>
                <p className="mt-3 max-w-2xl text-body text-foreground/80">{enquiry.message}</p>
                {enquiry.handledBy?.name ? (
                  <p className="mt-2 text-caption text-muted-foreground">
                    Handled by {enquiry.handledBy.name}
                  </p>
                ) : null}
              </div>

              {/* Actions */}
              <div className="lg:col-span-3 lg:justify-self-end">
                <EnquiryStatusControl id={enquiry.id} status={enquiry.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

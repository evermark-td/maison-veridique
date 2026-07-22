import { siteConfig } from '@/lib/seo';
import type { EnquiryType } from '@/lib/validations/enquiry';

import { renderEmail } from './layout';

// Labels are composed with the word "enquiry" in subjects/headings, so none of
// them include it themselves (e.g. GENERAL is "General", not "General enquiry").
const TYPE_LABELS: Record<EnquiryType, string> = {
  APPOINTMENT: 'Appointment',
  BESPOKE: 'Bespoke commission',
  PRESS: 'Press',
  GENERAL: 'General',
};

export type EnquiryEmailData = {
  type: EnquiryType;
  fullName: string;
  email: string;
  phone?: string | null;
  message: string;
  receivedAt: Date;
};

type RenderedEmail = { subject: string; html: string; text: string };

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function formatReceived(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Internal notification sent to the house when a new enquiry arrives. The
 * send should set `replyTo` to the enquirer so an advisor can reply directly.
 */
export function enquiryNotificationEmail(data: EnquiryEmailData): RenderedEmail {
  const label = TYPE_LABELS[data.type];
  const subject = `New ${label.toLowerCase()} enquiry — ${data.fullName}`;

  const rows = [
    { label: 'Type', value: label },
    { label: 'Name', value: data.fullName },
    { label: 'Email', value: data.email },
    ...(data.phone ? [{ label: 'Phone', value: data.phone }] : []),
    { label: 'Received', value: formatReceived(data.receivedAt) },
  ];

  const html = renderEmail({
    preheader: `${label} enquiry from ${data.fullName}.`,
    sections: [
      { type: 'eyebrow', text: 'New enquiry' },
      { type: 'heading', text: `${label} enquiry.` },
      { type: 'details', rows },
      { type: 'messageBlock', text: data.message },
      {
        type: 'paragraph',
        text: `Reply to this email to respond to ${firstName(data.fullName)} directly.`,
      },
    ],
  });

  const text = [
    `New ${label.toLowerCase()} enquiry.`,
    '',
    ...rows.map((r) => `${r.label}: ${r.value}`),
    '',
    'Message:',
    data.message,
    '',
    `Reply to this email to respond to ${firstName(data.fullName)} directly.`,
  ].join('\n');

  return { subject, html, text };
}

/**
 * Courtesy acknowledgement sent to the client who submitted the enquiry.
 */
export function enquiryAcknowledgementEmail(
  data: Pick<EnquiryEmailData, 'type' | 'fullName'>,
): RenderedEmail {
  const label = TYPE_LABELS[data.type];
  const subject = `We've received your enquiry — ${siteConfig.name}`;

  const html = renderEmail({
    preheader: 'Your message is with the house — an advisor will respond within one business day.',
    sections: [
      { type: 'eyebrow', text: 'Received' },
      { type: 'heading', text: 'Your message is with the house.' },
      {
        type: 'paragraph',
        text: `Thank you, ${firstName(data.fullName)}. We have received your ${label.toLowerCase()} enquiry and a client advisor will respond within one business day.`,
      },
      {
        type: 'paragraph',
        text: 'If your enquiry is time-sensitive, you are always welcome to call the house directly.',
      },
    ],
  });

  const text = [
    'Your message is with the house.',
    '',
    `Thank you, ${firstName(data.fullName)}. We have received your ${label.toLowerCase()} enquiry and a client advisor will respond within one business day.`,
    '',
    'If your enquiry is time-sensitive, you are always welcome to call the house directly.',
    '',
    `${siteConfig.name} · Paris · Milano · Tokyo`,
  ].join('\n');

  return { subject, html, text };
}

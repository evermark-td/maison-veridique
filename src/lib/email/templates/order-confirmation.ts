import { siteConfig } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

import { renderEmail, type EmailLineItem } from './layout';

export type OrderConfirmationData = {
  orderNumber: string;
  currency: string;
  items: { name: string; sku: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  address: {
    fullName: string;
    line1: string;
    line2?: string | null;
    city: string;
    region?: string | null;
    postalCode: string;
    country: string;
  };
};

/**
 * Order acknowledgement. Mirrors the on-site confirmation page: the house takes
 * no payment online, so this confirms the order is received and that an advisor
 * will follow up to arrange payment and delivery.
 */
export function orderConfirmationEmail(data: OrderConfirmationData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Your order ${data.orderNumber} — ${siteConfig.name}`;

  const lineItems: EmailLineItem[] = data.items.map((item) => ({
    name: item.name,
    meta: `${item.sku} · ×${item.quantity}`,
    amount: formatPrice(item.unitPrice * item.quantity, data.currency),
  }));

  const addressLines = [
    data.address.fullName,
    data.address.line1,
    data.address.line2 ?? '',
    [data.address.city, data.address.region, data.address.postalCode].filter(Boolean).join(', '),
    data.address.country,
  ];

  const html = renderEmail({
    preheader: `Order ${data.orderNumber} is with the house — an advisor will be in touch within one business day.`,
    sections: [
      { type: 'eyebrow', text: 'Thank you' },
      { type: 'heading', text: 'Your order is with the house.' },
      {
        type: 'paragraph',
        text: `Order ${data.orderNumber} is confirmed. A client advisor will be in touch within one business day to arrange payment and delivery.`,
      },
      { type: 'lineItems', items: lineItems },
      {
        type: 'totals',
        rows: [
          { label: 'Subtotal', value: formatPrice(data.subtotal, data.currency) },
          {
            label: 'Shipping',
            value:
              data.shipping === 0 ? 'Complimentary' : formatPrice(data.shipping, data.currency),
          },
          { label: 'Total', value: formatPrice(data.total, data.currency), strong: true },
        ],
      },
      { type: 'divider' },
      { type: 'addressBlock', label: 'Delivery to', lines: addressLines },
    ],
  });

  const money = (n: number) => formatPrice(n, data.currency);
  const text = [
    'Your order is with the house.',
    '',
    `Order ${data.orderNumber} is confirmed. A client advisor will be in touch within one business day to arrange payment and delivery.`,
    '',
    ...data.items.map(
      (item) =>
        `${item.name} (${item.sku}) ×${item.quantity} — ${money(item.unitPrice * item.quantity)}`,
    ),
    '',
    `Subtotal: ${money(data.subtotal)}`,
    `Shipping: ${data.shipping === 0 ? 'Complimentary' : money(data.shipping)}`,
    `Total: ${money(data.total)}`,
    '',
    'Delivery to:',
    ...addressLines.filter(Boolean),
    '',
    `${siteConfig.name} · Paris · Milano · Tokyo`,
  ].join('\n');

  return { subject, html, text };
}

import { siteConfig } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';

import { renderEmail } from './layout';
import {
  orderAddressLines,
  orderLineItems,
  orderTotalsRows,
  type OrderAddress,
  type OrderItemLine,
} from './order-parts';

export type OrderConfirmationData = {
  orderNumber: string;
  currency: string;
  items: OrderItemLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
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

  const lineItems = orderLineItems(data.items, data.currency);
  const addressLines = orderAddressLines(data.address);

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
        rows: orderTotalsRows(data.subtotal, data.shipping, data.total, data.currency),
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

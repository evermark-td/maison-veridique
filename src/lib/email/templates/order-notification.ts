import { formatPrice } from '@/lib/utils';

import { renderEmail } from './layout';
import {
  orderAddressLines,
  orderLineItems,
  orderTotalsRows,
  type OrderAddress,
  type OrderItemLine,
} from './order-parts';

export type OrderNotificationData = {
  orderNumber: string;
  currency: string;
  customerName: string;
  customerEmail: string;
  placedAt: Date;
  items: OrderItemLine[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
};

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function formatPlaced(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Internal notification sent to the house when an order is placed, so an
 * advisor can follow up to arrange payment and delivery. The send should set
 * `replyTo` to the customer so an advisor can reply to them directly.
 */
export function orderNotificationEmail(data: OrderNotificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New order ${data.orderNumber} — ${data.customerName}`;

  const html = renderEmail({
    preheader: `${data.customerName} placed order ${data.orderNumber} for ${formatPrice(data.total, data.currency)}.`,
    sections: [
      { type: 'eyebrow', text: 'New order' },
      { type: 'heading', text: `Order ${data.orderNumber}.` },
      {
        type: 'details',
        rows: [
          { label: 'Customer', value: data.customerName },
          { label: 'Email', value: data.customerEmail },
          { label: 'Placed', value: formatPlaced(data.placedAt) },
        ],
      },
      { type: 'lineItems', items: orderLineItems(data.items, data.currency) },
      {
        type: 'totals',
        rows: orderTotalsRows(data.subtotal, data.shipping, data.total, data.currency),
      },
      { type: 'divider' },
      { type: 'addressBlock', label: 'Delivery to', lines: orderAddressLines(data.address) },
      {
        type: 'paragraph',
        text: `Reply to this email to reach ${firstName(data.customerName)} and arrange payment and delivery.`,
      },
    ],
  });

  const money = (n: number) => formatPrice(n, data.currency);
  const text = [
    `New order ${data.orderNumber}.`,
    '',
    `Customer: ${data.customerName}`,
    `Email: ${data.customerEmail}`,
    `Placed: ${formatPlaced(data.placedAt)}`,
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
    ...orderAddressLines(data.address).filter(Boolean),
    '',
    `Reply to this email to reach ${firstName(data.customerName)} and arrange payment and delivery.`,
  ].join('\n');

  return { subject, html, text };
}

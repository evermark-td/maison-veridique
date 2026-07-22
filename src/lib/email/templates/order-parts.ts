import { formatPrice } from '@/lib/utils';

import type { EmailLineItem, EmailTotalRow } from './layout';

// Shapes shared by the customer order confirmation and the house order
// notification, so both emails render line items, totals and the delivery
// address identically from the same order data.
export type OrderItemLine = { name: string; sku: string; quantity: number; unitPrice: number };
export type OrderAddress = {
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  region?: string | null;
  postalCode: string;
  country: string;
};

export function orderLineItems(items: OrderItemLine[], currency: string): EmailLineItem[] {
  return items.map((item) => ({
    name: item.name,
    meta: `${item.sku} · ×${item.quantity}`,
    amount: formatPrice(item.unitPrice * item.quantity, currency),
  }));
}

export function orderAddressLines(address: OrderAddress): string[] {
  return [
    address.fullName,
    address.line1,
    address.line2 ?? '',
    [address.city, address.region, address.postalCode].filter(Boolean).join(', '),
    address.country,
  ];
}

export function orderTotalsRows(
  subtotal: number,
  shipping: number,
  total: number,
  currency: string,
): EmailTotalRow[] {
  return [
    { label: 'Subtotal', value: formatPrice(subtotal, currency) },
    {
      label: 'Shipping',
      value: shipping === 0 ? 'Complimentary' : formatPrice(shipping, currency),
    },
    { label: 'Total', value: formatPrice(total, currency), strong: true },
  ];
}

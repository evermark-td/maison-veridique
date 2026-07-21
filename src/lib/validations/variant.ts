import { z } from 'zod';

/**
 * Variant contract — one sellable configuration of a product (colour × size),
 * carrying its own SKU, price and stock.
 */
export const variantSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, 'Give the variant a SKU.')
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, 'Letters, numbers and hyphens only.')
    .transform((value) => value.toUpperCase()),
  colorName: z.string().trim().min(2, 'Name the colour.').max(40),
  colorHex: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex colour like #1A1A1A.'),
  size: z.string().trim().min(1, 'Give the size.').max(20),
  price: z.coerce
    .number({ message: 'Enter a price.' })
    .positive('Price must be above zero.')
    .max(1_000_000, 'That price looks wrong.'),
  stock: z.coerce.number({ message: 'Enter stock.' }).int().min(0).max(100000),
});

export type VariantInput = z.infer<typeof variantSchema>;

export const stockSchema = z.coerce.number().int().min(0).max(100000);

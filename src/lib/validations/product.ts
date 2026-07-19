import { z } from 'zod';

export const productCurrencies = ['EUR', 'USD', 'GBP'] as const;

/**
 * Product contract — shared by the admin form (RHF resolver) and the server
 * actions that persist to the `Product` table. Variants (size/colour/stock)
 * have their own schema and are managed per-product.
 */
export const productSchema = z.object({
  name: z.string().trim().min(2, 'Give the piece a name.').max(120),
  description: z
    .string()
    .trim()
    .min(10, 'Describe the piece in at least a sentence.')
    .max(2000),
  story: z.string().trim().max(4000).optional().or(z.literal('')),
  composition: z.string().trim().max(500).optional().or(z.literal('')),
  careInstructions: z.string().trim().max(1000).optional().or(z.literal('')),
  basePrice: z.coerce
    .number({ message: 'Enter a price.' })
    .positive('Price must be above zero.')
    .max(1_000_000, 'That price looks wrong.'),
  currency: z.enum(productCurrencies).default('EUR'),
  collectionId: z
    .string()
    .cuid()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export type ProductInput = z.infer<typeof productSchema>;

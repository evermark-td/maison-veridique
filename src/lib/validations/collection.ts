import { z } from 'zod';

/**
 * Collection contract — shared by the admin form (RHF resolver) and the
 * server actions that persist to the `Collection` table.
 */
export const collectionSchema = z.object({
  title: z.string().trim().min(2, 'Give the collection a title.').max(80),
  subtitle: z.string().trim().max(120).optional().or(z.literal('')),
  season: z.string().trim().max(40).optional().or(z.literal('')),
  year: z.coerce
    .number()
    .int()
    .min(2000, 'Year looks wrong.')
    .max(2100, 'Year looks wrong.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  description: z.string().trim().max(2000).optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

import { z } from 'zod';

export const testimonialSchema = z.object({
  quoteText: z.string().trim().min(10, 'Enter the quote.').max(500),
  authorName: z.string().trim().min(2, 'Enter the author.').max(80),
  authorTitle: z.string().trim().max(120).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

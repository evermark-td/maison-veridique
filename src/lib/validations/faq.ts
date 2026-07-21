import { z } from 'zod';

export const faqSchema = z.object({
  question: z.string().trim().min(4, 'Enter the question.').max(200),
  answer: z.string().trim().min(4, 'Enter the answer.').max(2000),
  category: z.string().trim().min(2, 'Enter a category.').max(40),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.boolean().default(true),
});

export type FaqInput = z.infer<typeof faqSchema>;

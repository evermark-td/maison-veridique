import { z } from 'zod';

export const journalSchema = z.object({
  title: z.string().trim().min(3, 'Enter a title.').max(160),
  excerpt: z.string().trim().min(10, 'Enter a short excerpt.').max(400),
  content: z.string().trim().min(20, 'Write the article.').max(20000),
  // Comma-separated in the form; split to an array in the action.
  tags: z.string().trim().max(200).optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
});

export type JournalInput = z.infer<typeof journalSchema>;

import { z } from 'zod';

/**
 * Newsletter subscription contract — shared by the footer form (RHF resolver)
 * and the Phase 4 route handler that creates a `Subscriber` and sends the
 * double opt-in confirmation email.
 */
export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

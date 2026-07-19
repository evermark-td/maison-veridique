import { z } from 'zod';

export const enquiryTypes = ['APPOINTMENT', 'BESPOKE', 'PRESS', 'GENERAL'] as const;
export type EnquiryType = (typeof enquiryTypes)[number];

/**
 * Enquiry form contract — shared by the client (RHF resolver) and the Phase 4
 * server action that persists to the `Enquiry` table. Mirrors the Prisma model.
 */
export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is too long.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .max(40, 'That number is too long.')
    .optional()
    .or(z.literal('')),
  type: z.enum(enquiryTypes, { message: 'Please choose an enquiry type.' }),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little more.')
    .max(1200, 'Please keep your message under 1200 characters.'),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

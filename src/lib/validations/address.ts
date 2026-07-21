import { z } from 'zod';

/**
 * Saved delivery address. Mirrors the checkout schema minus the email — an
 * address belongs to an account, not a single order.
 */
export const addressSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter the recipient’s name.').max(80),
  line1: z.string().trim().min(3, 'Enter the street address.').max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Enter the city.').max(80),
  region: z.string().trim().max(80).optional().or(z.literal('')),
  postalCode: z.string().trim().min(2, 'Enter the postal code.').max(20),
  country: z.string().trim().min(2, 'Enter the country.').max(80),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
});

export type AddressInput = z.infer<typeof addressSchema>;

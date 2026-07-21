import { z } from 'zod';

/**
 * Shipping details captured at checkout. Shared by the client form (RHF
 * resolver) and the `placeOrder` server action.
 */
export const checkoutSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  fullName: z.string().trim().min(2, 'Enter the recipient’s name.').max(80),
  line1: z.string().trim().min(3, 'Enter the street address.').max(120),
  line2: z.string().trim().max(120).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Enter the city.').max(80),
  region: z.string().trim().max(80).optional().or(z.literal('')),
  postalCode: z.string().trim().min(2, 'Enter the postal code.').max(20),
  country: z.string().trim().min(2, 'Enter the country.').max(80),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

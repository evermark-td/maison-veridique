import { Cormorant_Garamond, Inter } from 'next/font/google';

/**
 * Display — high-contrast serif. Weights limited to 300/400 by house rule.
 */
export const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-family',
});

/**
 * UI — geometric grotesk for body copy and micro labels.
 */
export const fontSans = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-sans-family',
});

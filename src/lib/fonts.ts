import { Cormorant_Garamond, Inter } from 'next/font/google';

/**
 * Display — high-contrast serif. Only the weights/styles actually rendered
 * are loaded. The .display utility uses weight 300; italic and weight 400
 * aren't referenced anywhere in the app, so we don't ship those files.
 */
export const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300'],
  style: ['normal'],
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

import { Open_Sans, Titillium_Web } from 'next/font/google';

/** Site fonts, shared by the public site and the kiosk screen (each has its own root layout). */
export const openSans = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const titillium = Titillium_Web({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-titillium',
  display: 'swap',
});

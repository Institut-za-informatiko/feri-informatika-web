import '../../(frontend)/globals.css';
import type { ReactNode } from 'react';
import { openSans, titillium } from '@/lib/fonts';

/** The info screen in the faculty: no site header or footer, full screen, Slovenian. */
export default function KioskLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sl" className={`${openSans.variable} ${titillium.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

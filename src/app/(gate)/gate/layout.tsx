import '../../(frontend)/globals.css';
import type { ReactNode } from 'react';
import { openSans, titillium } from '@/lib/fonts';

/** The password screen in front of the preview site: no header or footer. */
export default function GateLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sl" className={`${openSans.variable} ${titillium.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

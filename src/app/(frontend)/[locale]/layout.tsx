import '../globals.css';
import { Open_Sans, Titillium_Web } from 'next/font/google';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { RefreshOnSave } from '@/components/client/RefreshOnSave';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { isLang } from '@/i18n/translations';

const openSans = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-open-sans',
  display: 'swap',
});
const titillium = Titillium_Web({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-titillium',
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s — Inštitut za informatiko FERI',
    default: 'Inštitut za informatiko FERI',
  },
  icons: { icon: '/favicon.svg' },
};

// Pages render on first request and stay cached until a CMS change revalidates them,
// so building the image needs no database.
export async function generateStaticParams() {
  return [];
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();
  const { isEnabled: draft } = await draftMode();

  return (
    <html
      lang={locale}
      className={`${openSans.variable} ${titillium.variable}`}
    >
      <body className="flex min-h-svh flex-col antialiased">
        <SiteHeader lang={locale} />
        {/* The navbar is fixed; keep content clear of it. */}
        <main className="flex-1 pt-16">{children}</main>
        <SiteFooter lang={locale} />
        {draft && <RefreshOnSave />}
      </body>
    </html>
  );
}

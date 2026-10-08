import { getTranslations, type Lang } from '@/i18n/translations';
import { findGlobal } from '@/lib/payload';

/** Contact details come from the "O inštitutu" global, so editors keep them current. */
export async function SiteFooter({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);
  const about = await findGlobal('about', lang, 0);

  return (
    <footer className="mt-16 bg-brand-dark text-primary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="font-heading text-lg font-semibold">{t('site.name')}</p>
          <p className="text-sm opacity-80">{t('site.faculty')}</p>
        </div>
        <ul className="flex flex-col gap-1 text-sm opacity-90 sm:items-end">
          {about.contactAddress && <li>{about.contactAddress}</li>}
          {about.contactEmail && (
            <li>
              <a
                className="underline-offset-4 hover:underline"
                href={`mailto:${about.contactEmail}`}
              >
                {about.contactEmail}
              </a>
            </li>
          )}
          {about.contactPhone && <li>{about.contactPhone}</li>}
        </ul>
      </div>
      <div className="border-t border-white/15">
        {/* biome-ignore lint/performance/noImgElement: static logo */}
        <img
          src="/logos/feri-logo.png"
          alt="FERI — Univerza v Mariboru"
          className="mx-auto my-6 h-10 w-auto brightness-0 invert"
        />
      </div>
    </footer>
  );
}

import { defaultLang, type Lang } from './translations';

/** Public URL for a path in a locale. Slovenian has no prefix, English lives under /en. */
export function localePath(lang: Lang, path: string): string {
  const prefix = lang === defaultLang ? '' : `/${lang}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${cleanPath}`;
}

/** The same page in the other language. */
export function getAlternateUrl(pathname: string, currentLang: Lang): string {
  const targetLang: Lang = currentLang === 'sl' ? 'en' : 'sl';
  const path =
    currentLang === 'en' ? pathname.replace(/^\/en/, '') || '/' : pathname;
  return localePath(targetLang, path);
}

export function getNavLinks(lang: Lang) {
  return [
    { key: 'nav.about', href: localePath(lang, '/about') },
    {
      key: 'nav.research',
      href: localePath(
        lang,
        lang === 'en' ? '/research/projects' : '/research/group'
      ),
    },
    { key: 'nav.studies', href: localePath(lang, '/studies/programmes') },
    { key: 'nav.conferences', href: localePath(lang, '/conferences') },
    { key: 'nav.industry', href: localePath(lang, '/industry') },
    { key: 'nav.achievements', href: localePath(lang, '/achievements') },
    { key: 'nav.news', href: localePath(lang, '/news') },
  ] as const;
}

const dateLocales: Record<Lang, string> = { sl: 'sl-SI', en: 'en-GB' };

export function formatDate(date: string | Date, lang: Lang): string {
  return new Date(date).toLocaleDateString(dateLocales[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

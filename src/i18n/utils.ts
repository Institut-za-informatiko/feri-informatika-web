import { defaultLang, type Lang } from './translations';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function localePath(lang: Lang, path: string): string {
  const prefix = lang === defaultLang ? '' : `/${lang}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${prefix}${cleanPath}`;
}

export function getAlternateUrl(currentUrl: URL, currentLang: Lang): string {
  const targetLang: Lang = currentLang === 'sl' ? 'en' : 'sl';

  let path = currentUrl.pathname.replace(BASE, '') || '/';

  if (currentLang === 'en') {
    path = path.replace(/^\/en/, '') || '/';
  }

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

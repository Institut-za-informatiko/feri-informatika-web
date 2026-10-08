import { getTranslations, type Lang } from '@/i18n/translations';
import { getNavLinks } from '@/i18n/utils';
import { MainNav } from './client/MainNav';

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);
  return (
    <MainNav
      lang={lang}
      siteName={t('site.name')}
      items={getNavLinks(lang).map((n) => ({ href: n.href, label: t(n.key) }))}
      labels={{
        menu: t('nav.menu'),
        close: t('nav.close'),
        language: t('nav.language'),
        home: t('nav.home'),
      }}
    />
  );
}

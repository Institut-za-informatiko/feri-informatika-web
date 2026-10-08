import type { SidebarLink } from '@/components/PageShell';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';

type Child = { name: string; slug: string };

/**
 * Sidebar shared by the "about" section (about, laboratories, interest groups, staff).
 * Pass the documents of the current section to list them under its link.
 */
export function aboutSidebar(
  lang: Lang,
  children: { labs?: Child[]; groups?: Child[]; staff?: Child[] } = {}
): SidebarLink[] {
  const t = getTranslations(lang);
  const link = (label: string, base: string, list?: Child[]): SidebarLink => ({
    label,
    href: localePath(lang, base),
    children: list?.map((c) => ({
      label: c.name,
      href: localePath(lang, `${base}/${c.slug}`),
      sidebarLevel: 'tertiary',
    })),
  });
  return [
    link(t('about.sidebar.labs'), '/laboratories', children.labs),
    link(t('about.sidebar.groups'), '/interest-groups', children.groups),
    link(t('about.sidebar.staff'), '/staff', children.staff),
  ];
}

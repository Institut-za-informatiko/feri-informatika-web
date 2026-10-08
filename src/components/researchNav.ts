import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import type { Project } from '@/payload-types';
import type { SidebarLink } from './PageShell';

/** Section menu shared by every research page; project pages also list the projects. */
export function researchSidebar(
  lang: Lang,
  projects: Pick<Project, 'title' | 'slug'>[] = []
) {
  const t = getTranslations(lang);
  const href = (path: string) => localePath(lang, path);
  const links: SidebarLink[] = [
    {
      label: t('research.sidebar.researchGroup'),
      href: href('/research/group'),
      children: [
        {
          label: t('research.sidebar.areas'),
          href: href('/research/group/areas'),
        },
        {
          label: t('research.sidebar.sicris'),
          href: href('/research/group/sicris'),
        },
      ],
    },
    {
      label: t('research.sidebar.projects'),
      href: href('/research/projects'),
      children: projects.map((p) => ({
        label: p.title,
        href: href(`/research/projects/${p.slug}`),
      })),
    },
    {
      label: t('research.sidebar.publications'),
      href: href('/research/publications'),
    },
    {
      label: t('research.sidebar.ethics'),
      href: href('/research/ethics'),
      children: [
        {
          label: t('research.sidebar.ethicsMandate'),
          href: href('/research/ethics/mandate'),
        },
        {
          label: t('research.sidebar.ethicsSubmissions'),
          href: href('/research/ethics/submissions'),
        },
      ],
    },
  ];
  return links;
}

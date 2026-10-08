import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getTranslations,
  type Lang,
  type TranslationKey,
} from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { findAll } from '@/lib/payload';
import type { StudentProject, StudyProgramme } from '@/payload-types';
import type { SidebarLink } from './PageShell';

export const findProgrammes = (lang: Lang) =>
  findAll('study-programmes', lang, { sort: 'title' });
export const findStudentProjects = (lang: Lang) =>
  findAll('student-projects', lang, { sort: '-year' });

/** "3 leta" / "3 years" with the right Slovene plural form. */
export function durationLabel(years: number, lang: Lang) {
  const t = getTranslations(lang);
  const form = new Intl.PluralRules(lang).select(years);
  return `${years} ${t(`studies.years.${form}` as TranslationKey)}`;
}

/** Section navigation for the studies pages; `expand` lists the entries under one of the two links. */
export function studiesSidebar(
  lang: Lang,
  expand:
    | { kind: 'programmes'; items: StudyProgramme[] }
    | { kind: 'student-projects'; items: StudentProject[] }
): SidebarLink[] {
  const t = getTranslations(lang);
  const children = (kind: typeof expand.kind) =>
    expand.kind === kind
      ? expand.items.map((i) => ({
          label: i.title,
          href: localePath(lang, `/studies/${kind}/${i.slug}`),
          sidebarLevel: 'tertiary' as const,
        }))
      : undefined;
  return [
    {
      label: t('studies.programmes.title'),
      href: localePath(lang, '/studies/programmes'),
      children: children('programmes'),
    },
    {
      label: t('studies.activities.title'),
      href: localePath(lang, '/studies/student-projects'),
      children: children('student-projects'),
    },
  ];
}

const cardLink =
  'group flex w-full rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none';

export function ProgrammeCard({
  programme: p,
  lang,
}: {
  programme: StudyProgramme;
  lang: Lang;
}) {
  return (
    <Link
      href={localePath(lang, `/studies/programmes/${p.slug}`)}
      className={cardLink}
    >
      <Card className="w-full border-t-4 border-t-primary transition-shadow group-hover:shadow-lg">
        <CardHeader className="gap-3">
          <Badge>{p.type}</Badge>
          <CardTitle className="text-lg leading-snug group-hover:text-primary">
            {p.title}
          </CardTitle>
          {p.scope && (
            <CardDescription className="line-clamp-3">
              {p.scope}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="mt-auto text-sm text-muted-foreground tabular-nums">
          {durationLabel(p.duration, lang)} · {p.ects} ECTS
        </CardFooter>
      </Card>
    </Link>
  );
}

export function StudentProjectCard({
  project: p,
  lang,
}: {
  project: StudentProject;
  lang: Lang;
}) {
  return (
    <Link
      href={localePath(lang, `/studies/student-projects/${p.slug}`)}
      className={cardLink}
    >
      <Card className="w-full border-t-4 border-t-primary transition-shadow group-hover:shadow-lg">
        <CardHeader className="gap-3">
          <CardTitle className="text-lg leading-snug group-hover:text-primary">
            {p.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {p.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto flex-wrap gap-x-1.5 text-sm text-muted-foreground">
          <span>{p.student}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{p.year}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}

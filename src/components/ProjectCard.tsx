import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import type { Project } from '@/payload-types';

/** Years shown on project cards and pages: "2021–2024", or "2023–present" while active. */
export function projectYears(p: Project, lang: Lang) {
  const t = getTranslations(lang);
  const end = p.endYear
    ? `–${p.endYear}`
    : p.status === 'active'
      ? `–${t('research.present')}`
      : '';
  return `${p.startYear ?? ''}${end}`;
}

export function ProjectStatus({
  project,
  lang,
}: {
  project: Project;
  lang: Lang;
}) {
  const t = getTranslations(lang);
  return project.status === 'active' ? (
    <Badge>{t('research.status.active')}</Badge>
  ) : (
    <Badge variant="secondary">{t('research.status.past')}</Badge>
  );
}

export function ProjectCard({
  project: p,
  lang,
}: {
  project: Project;
  lang: Lang;
}) {
  return (
    <Link
      href={localePath(lang, `/research/projects/${p.slug}`)}
      className="group flex w-full rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card className="w-full border-t-4 border-t-primary transition-shadow group-hover:shadow-lg">
        <CardHeader className="gap-3">
          <ProjectStatus project={p} lang={lang} />
          <CardTitle className="text-lg leading-snug group-hover:text-primary">
            {p.title}
          </CardTitle>
          <CardDescription className="line-clamp-3">
            {p.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto text-sm text-muted-foreground tabular-nums">
          {projectYears(p, lang)}
        </CardFooter>
      </Card>
    </Link>
  );
}

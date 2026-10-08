import { ArrowRightIcon } from 'lucide-react';
import { Section, SectionNews } from '@/components/cards';
import { BackLink } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { ProjectStatus, projectYears } from '@/components/ProjectCard';
import { RichText } from '@/components/RichText';
import { researchSidebar } from '@/components/researchNav';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { findAll, findBySlug } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = await findBySlug('projects', slug, locale);
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const [project, projects] = await Promise.all([
    findBySlug('projects', slug, lang),
    findAll('projects', lang, { sort: '-startYear' }),
  ]);
  const years = projectYears(project, lang);

  const details = [
    {
      label: t('research.project.status'),
      value: <ProjectStatus project={project} lang={lang} />,
    },
    years && { label: t('research.project.period'), value: years },
    project.funder && {
      label: t('research.project.funder'),
      value: project.funder,
    },
    project.principalInvestigator && {
      label: t('research.project.pi'),
      value: project.principalInvestigator,
    },
  ].filter((d) => !!d);

  return (
    <PageShell
      lang={lang}
      title={project.title}
      lead={project.description}
      sidebarLinks={researchSidebar(lang, projects)}
    >
      <Card>
        <CardContent>
          <h2 className="sr-only">{t('research.project.details')}</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="flex flex-col gap-1">
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {d.label}
                </dt>
                <dd className="tabular-nums">{d.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {project.body ? (
        <Section title={t('research.project.description')}>
          <Prose className="wrap-break-word [&>*>:first-child]:mt-0 [&>*>:last-child]:mb-0">
            <RichText data={project.body} />
          </Prose>
        </Section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <BackLink href={localePath(lang, '/research/projects')}>
          {t('research.project.backLink')}
        </BackLink>
        {project.newsLink && (
          <a href={project.newsLink} className={buttonVariants()}>
            {t('research.project.relatedNews')}
            <ArrowRightIcon data-icon="inline-end" />
          </a>
        )}
      </div>

      <SectionNews tag="project" lang={lang} />
    </PageShell>
  );
}

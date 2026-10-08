import { CardGrid, EmptyState, Section, SectionNews } from '@/components/cards';
import { PageShell } from '@/components/PageShell';
import { ProjectCard } from '@/components/ProjectCard';
import { researchSidebar } from '@/components/researchNav';
import { getTranslations, type Lang } from '@/i18n/translations';
import { findAll } from '@/lib/payload';
import type { Project } from '@/payload-types';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: getTranslations(locale)('research.sidebar.projects') };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const projects = await findAll('projects', lang, { sort: '-startYear' });
  const active = projects.filter((p) => p.status === 'active');
  const past = projects.filter((p) => p.status !== 'active');

  const grid = (list: Project[]) => (
    <CardGrid>
      {list.map((p) => (
        <ProjectCard key={p.id} project={p} lang={lang} />
      ))}
    </CardGrid>
  );

  return (
    <PageShell
      lang={lang}
      title={t('research.sidebar.projects')}
      sidebarLinks={researchSidebar(lang, projects)}
    >
      {projects.length === 0 && (
        <EmptyState>{t('research.noProjects')}</EmptyState>
      )}
      {active.length > 0 && (
        <Section title={t('research.activeProjects')}>{grid(active)}</Section>
      )}
      {past.length > 0 && (
        <Section title={t('research.pastProjects')}>{grid(past)}</Section>
      )}
      <SectionNews tag="project" lang={lang} />
    </PageShell>
  );
}

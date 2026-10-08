import { CardGrid, EmptyState, Section, SectionNews } from '@/components/cards';
import { PageShell } from '@/components/PageShell';
import {
  findStudentProjects,
  StudentProjectCard,
  studiesSidebar,
} from '@/components/studies';
import { getTranslations, type Lang } from '@/i18n/translations';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: t('studies.activities.title'),
    description: t('studies.activities.intro'),
  };
}

export default async function StudentProjectsPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const projects = await findStudentProjects(lang);

  return (
    <PageShell
      lang={lang}
      title={t('studies.activities.title')}
      lead={t('studies.activities.intro')}
      sidebarLinks={studiesSidebar(lang, {
        kind: 'student-projects',
        items: projects,
      })}
    >
      <Section title={t('studies.activities.projects')}>
        {projects.length === 0 ? (
          <EmptyState>{t('studies.activities.noContent')}</EmptyState>
        ) : (
          <CardGrid>
            {projects.map((p) => (
              <StudentProjectCard key={p.id} project={p} lang={lang} />
            ))}
          </CardGrid>
        )}
      </Section>
      <SectionNews tag="student" lang={lang} />
    </PageShell>
  );
}

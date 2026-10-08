import { Section, SectionNews } from '@/components/cards';
import { BackLink, ExternalLinkButton, FactList } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { findStudentProjects, studiesSidebar } from '@/components/studies';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { findBySlug } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = await findBySlug('student-projects', slug, locale);
  return { title: project.title, description: project.description };
}

export default async function StudentProjectPage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const [project, projects] = await Promise.all([
    findBySlug('student-projects', slug, lang),
    findStudentProjects(lang),
  ]);

  return (
    <PageShell
      lang={lang}
      title={project.title}
      lead={project.description}
      sidebarLinks={studiesSidebar(lang, {
        kind: 'student-projects',
        items: projects,
      })}
    >
      <Section title={t('studies.activities.info')}>
        <FactList
          items={[
            { label: t('studies.activities.students'), value: project.student },
            { label: t('studies.activities.year'), value: project.year },
          ]}
        />
      </Section>
      {project.body && (
        <Section title={t('studies.activities.details')}>
          <Prose>
            <RichText data={project.body} />
          </Prose>
        </Section>
      )}
      <div className="flex flex-wrap gap-3">
        {project.externalUrl && (
          <ExternalLinkButton href={project.externalUrl}>
            {t('studies.activities.external')}
          </ExternalLinkButton>
        )}
        <BackLink href={localePath(lang, '/studies/student-projects')}>
          {t('studies.activities.backLink')}
        </BackLink>
      </div>
      <SectionNews tag="student" lang={lang} />
    </PageShell>
  );
}

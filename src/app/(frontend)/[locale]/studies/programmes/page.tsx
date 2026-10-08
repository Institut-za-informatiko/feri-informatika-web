import { CardGrid, EmptyState, Section, SectionNews } from '@/components/cards';
import { PageShell } from '@/components/PageShell';
import {
  findProgrammes,
  ProgrammeCard,
  studiesSidebar,
} from '@/components/studies';
import { getTranslations, type Lang } from '@/i18n/translations';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return {
    title: t('studies.programmes.title'),
    description: t('studies.programmes.intro'),
  };
}

export default async function ProgrammesPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const programmes = await findProgrammes(lang);

  return (
    <PageShell
      lang={lang}
      title={t('studies.programmes.title')}
      lead={t('studies.programmes.intro')}
      sidebarLinks={studiesSidebar(lang, {
        kind: 'programmes',
        items: programmes,
      })}
    >
      <Section title={t('studies.programmes.available')}>
        {programmes.length === 0 ? (
          <EmptyState>{t('studies.noContent')}</EmptyState>
        ) : (
          <CardGrid>
            {programmes.map((p) => (
              <ProgrammeCard key={p.id} programme={p} lang={lang} />
            ))}
          </CardGrid>
        )}
      </Section>
      <SectionNews tag="student" lang={lang} />
    </PageShell>
  );
}

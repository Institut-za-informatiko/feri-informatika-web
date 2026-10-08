import {
  ConferenceCard,
  conferencesSidebar,
  findConferences,
} from '@/components/ConferenceCard';
import { CardGrid, EmptyState, SectionNews } from '@/components/cards';
import { PageShell } from '@/components/PageShell';
import { getTranslations, type Lang } from '@/i18n/translations';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale);
  return { title: t('conferences.title'), description: t('conferences.intro') };
}

export default async function ConferencesPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const conferences = await findConferences(lang);

  return (
    <PageShell
      lang={lang}
      title={t('conferences.title')}
      lead={t('conferences.intro')}
      sidebarLinks={conferencesSidebar(lang, conferences)}
    >
      {conferences.length === 0 ? (
        <EmptyState>{t('conferences.noContent')}</EmptyState>
      ) : (
        <CardGrid>
          {conferences.map((c) => (
            <ConferenceCard key={c.id} conference={c} lang={lang} />
          ))}
        </CardGrid>
      )}
      <SectionNews tag="conference" lang={lang} />
    </PageShell>
  );
}

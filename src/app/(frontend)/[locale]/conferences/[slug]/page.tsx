import {
  conferencesSidebar,
  findConferences,
} from '@/components/ConferenceCard';
import { Section, SectionNews } from '@/components/cards';
import { BackLink, ExternalLinkButton, FactList } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { Badge } from '@/components/ui/badge';
import { getTranslations, type Lang } from '@/i18n/translations';
import { formatDate, localePath } from '@/i18n/utils';
import { findBySlug } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const conference = await findBySlug('conferences', slug, locale);
  return { title: conference.name, description: conference.description };
}

export default async function ConferencePage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const [conference, conferences] = await Promise.all([
    findBySlug('conferences', slug, lang),
    findConferences(lang),
  ]);

  return (
    <PageShell
      lang={lang}
      title={conference.name}
      eyebrow={
        conference.acronym && (
          <Badge variant="secondary">{conference.acronym}</Badge>
        )
      }
      lead={conference.description}
      sidebarLinks={conferencesSidebar(lang, conferences)}
    >
      {(conference.date || conference.location) && (
        <Section title={t('conferences.details')}>
          <FactList
            items={[
              {
                label: t('conferences.date'),
                value: conference.date && (
                  <time dateTime={conference.date}>
                    {formatDate(conference.date, lang)}
                  </time>
                ),
              },
              { label: t('conferences.location'), value: conference.location },
            ]}
          />
        </Section>
      )}
      {conference.body && (
        <Section title={t('conferences.about')}>
          <Prose>
            <RichText data={conference.body} />
          </Prose>
        </Section>
      )}
      <div className="flex flex-wrap gap-3">
        {conference.url && (
          <ExternalLinkButton href={conference.url}>
            {t('conferences.website')}
          </ExternalLinkButton>
        )}
        <BackLink href={localePath(lang, '/conferences')}>
          {t('conferences.backLink')}
        </BackLink>
      </div>
      <SectionNews tag="conference" lang={lang} />
    </PageShell>
  );
}

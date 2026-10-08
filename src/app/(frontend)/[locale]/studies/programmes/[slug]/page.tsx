import { Section, SectionNews } from '@/components/cards';
import { BackLink, ExternalLinkButton, FactList } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import {
  durationLabel,
  findProgrammes,
  studiesSidebar,
} from '@/components/studies';
import { Badge } from '@/components/ui/badge';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { findBySlug } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const programme = await findBySlug('study-programmes', slug, locale);
  return { title: programme.title, description: programme.scope };
}

export default async function ProgrammePage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const [programme, programmes] = await Promise.all([
    findBySlug('study-programmes', slug, lang),
    findProgrammes(lang),
  ]);

  return (
    <PageShell
      lang={lang}
      title={programme.title}
      eyebrow={<Badge>{programme.type}</Badge>}
      lead={programme.scope}
      sidebarLinks={studiesSidebar(lang, {
        kind: 'programmes',
        items: programmes,
      })}
    >
      <Section title={t('studies.programmes.info')}>
        <FactList
          items={[
            { label: t('studies.programmes.type'), value: programme.type },
            {
              label: t('studies.programmes.duration'),
              value: durationLabel(programme.duration, lang),
            },
            { label: t('studies.programmes.ects'), value: programme.ects },
          ]}
        />
      </Section>
      {programme.body && (
        <Section title={t('studies.programmes.curriculum')}>
          <Prose>
            <RichText data={programme.body} />
          </Prose>
        </Section>
      )}
      <div className="flex flex-wrap gap-3">
        {programme.externalUrl && (
          <ExternalLinkButton href={programme.externalUrl}>
            {t('studies.programmes.external')}
          </ExternalLinkButton>
        )}
        <BackLink href={localePath(lang, '/studies/programmes')}>
          {t('studies.programmes.backLink')}
        </BackLink>
      </div>
      <SectionNews tag="student" lang={lang} />
    </PageShell>
  );
}

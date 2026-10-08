import { aboutSidebar } from '@/components/aboutNav';
import { Section, SectionNews } from '@/components/cards';
import { ExternalLinkButton } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { getTranslations, type Lang } from '@/i18n/translations';
import { findAll, findBySlug } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const group = await findBySlug('interest-groups', slug, locale, 0);
  return { title: group.name, description: group.description };
}

export default async function InterestGroupPage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const [group, groups] = await Promise.all([
    findBySlug('interest-groups', slug, lang),
    findAll('interest-groups', lang, { sort: 'name', depth: 0 }),
  ]);

  return (
    <PageShell
      lang={lang}
      title={group.name}
      lead={group.description}
      sidebarTitle={t('about.title')}
      sidebarLinks={aboutSidebar(lang, { groups })}
    >
      {group.body && (
        <Section title={t('groups.about')}>
          <Prose>
            <RichText data={group.body} />
          </Prose>
        </Section>
      )}
      {group.url && (
        <ExternalLinkButton href={group.url}>
          {t('groups.website')}
        </ExternalLinkButton>
      )}
      <SectionNews tag="interest-groups" lang={lang} />
    </PageShell>
  );
}

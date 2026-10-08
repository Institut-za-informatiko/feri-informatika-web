import { aboutSidebar } from '@/components/aboutNav';
import { Section, SectionNews } from '@/components/cards';
import { ArrowLinkList } from '@/components/details';
import { PageShell } from '@/components/PageShell';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { findAll } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: getTranslations(locale)('about.sidebar.groups') };
}

export default async function InterestGroupsPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const groups = await findAll('interest-groups', lang, {
    sort: 'name',
    depth: 0,
  });

  return (
    <PageShell
      lang={lang}
      title={t('about.sidebar.groups')}
      lead={t('groups.intro')}
      sidebarTitle={t('about.title')}
      sidebarLinks={aboutSidebar(lang, { groups })}
    >
      <Section title={t('groups.listTitle')}>
        <ArrowLinkList
          emptyLabel={t('groups.noContent')}
          items={groups.map((g) => ({
            key: g.id,
            href: localePath(lang, `/interest-groups/${g.slug}`),
            label: g.name,
          }))}
        />
      </Section>
      <SectionNews tag="interest-groups" lang={lang} />
    </PageShell>
  );
}

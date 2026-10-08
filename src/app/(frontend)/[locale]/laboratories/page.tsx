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
  return { title: getTranslations(locale)('about.sidebar.labs') };
}

export default async function LaboratoriesPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const labs = await findAll('laboratories', lang, { sort: 'name', depth: 0 });

  return (
    <PageShell
      lang={lang}
      title={t('about.sidebar.labs')}
      lead={t('labs.intro')}
      sidebarTitle={t('about.title')}
      sidebarLinks={aboutSidebar(lang, { labs })}
    >
      <Section title={t('labs.listTitle')}>
        <ArrowLinkList
          emptyLabel={t('labs.noContent')}
          items={labs.map((lab) => ({
            key: lab.id,
            href: localePath(lang, `/laboratories/${lab.slug}`),
            label: (
              <>
                {lab.name}
                {lab.acronym && (
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                    ({lab.acronym})
                  </span>
                )}
              </>
            ),
          }))}
        />
      </Section>
      <SectionNews tag="interest-groups" lang={lang} />
    </PageShell>
  );
}

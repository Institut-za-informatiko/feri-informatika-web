import { SectionNews } from '@/components/cards';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { researchSidebar } from '@/components/researchNav';
import { getTranslations, type Lang } from '@/i18n/translations';
import { findGlobal } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: getTranslations(locale)('researchGroup.title') };
}

export default async function ResearchGroupPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const group = await findGlobal('research-group', lang);

  return (
    <PageShell
      lang={lang}
      title={t('researchGroup.title')}
      sidebarLinks={researchSidebar(lang)}
    >
      <Prose className="wrap-break-word prose-h1:text-2xl sm:prose-h1:text-3xl [&>*>:first-child]:mt-0 [&>*>:last-child]:mb-0">
        <RichText data={group.body} />
      </Prose>
      <SectionNews tag="scientific" lang={lang} />
    </PageShell>
  );
}

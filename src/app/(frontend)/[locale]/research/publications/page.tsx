import { CmsPage, cmsPageMetadata } from '@/components/CmsPage';
import { researchSidebar } from '@/components/researchNav';
import type { Lang } from '@/i18n/translations';

type Props = { params: Promise<{ locale: Lang }> };

const SLUG = 'research/publications';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return cmsPageMetadata(SLUG, locale);
}

export default async function PublicationsPage({ params }: Props) {
  const { locale: lang } = await params;
  return (
    <CmsPage
      slug={SLUG}
      lang={lang}
      sidebarLinks={researchSidebar(lang)}
      newsTag="scientific"
    />
  );
}

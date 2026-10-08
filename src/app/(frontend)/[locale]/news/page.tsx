import { NewsCard, TagFilteredGrid } from '@/components/cards';
import { PageShell } from '@/components/PageShell';
import { getTranslations, type Lang } from '@/i18n/translations';
import { byDateDesc, findAll } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: getTranslations(locale)('news.title') };
}

export default async function NewsPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const news = (await findAll('news', lang)).sort(byDateDesc);

  return (
    <PageShell lang={lang} title={t('news.title')} wide>
      <TagFilteredGrid
        lang={lang}
        emptyLabel={t('news.noContent')}
        items={news.map((n) => ({
          key: n.id,
          tags: n.tags,
          node: <NewsCard item={n} lang={lang} />,
        }))}
      />
    </PageShell>
  );
}

import { CoverImage, Gallery, TagList } from '@/components/cards';
import { BackLink } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { getTranslations, type Lang } from '@/i18n/translations';
import { formatDate, localePath } from '@/i18n/utils';
import { coverOf, toImage } from '@/lib/media';
import { findBySlug } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = await findBySlug('news', slug, locale);
  const image = coverOf(article);
  return {
    title: article.title,
    description: article.summary,
    openGraph: image ? { images: [image.src] } : undefined,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const article = await findBySlug('news', slug, lang);
  const cover = toImage(article.coverImage) ?? coverOf(article);

  return (
    <PageShell
      lang={lang}
      title={article.title}
      eyebrow={
        <time dateTime={article.date}>{formatDate(article.date, lang)}</time>
      }
      lead={article.summary}
    >
      <TagList tags={article.tags} lang={lang} />
      <CoverImage image={cover} alt={article.title} />
      <Prose>
        <RichText data={article.body} />
      </Prose>
      <Gallery images={article.images} lang={lang} title={article.title} />
      <BackLink href={localePath(lang, '/news')}>{t('news.backLink')}</BackLink>
    </PageShell>
  );
}

import { PlayIcon } from 'lucide-react';
import Link from 'next/link';
import {
  CoverImage,
  Gallery,
  Section,
  SectionNews,
  TagList,
} from '@/components/cards';
import { BackLink } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { buttonVariants } from '@/components/ui/button';
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
  const achievement = await findBySlug('achievements', slug, locale);
  const image = coverOf(achievement);
  return {
    title: achievement.title,
    description: achievement.summary ?? achievement.subtitle,
    openGraph: image ? { images: [image.src] } : undefined,
  };
}

/** Files hosted with the site play inline; anything else (YouTube, …) is linked. */
const isPlayable = (url: string) =>
  (url.startsWith('/') && !url.startsWith('//')) ||
  /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);

export default async function AchievementPage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const achievement = await findBySlug('achievements', slug, lang);
  const cover = toImage(achievement.coverImage);
  const videos = (achievement.videos ?? []).map((v) => v.url).filter(Boolean);

  return (
    <PageShell
      lang={lang}
      title={achievement.title}
      eyebrow={
        achievement.date && (
          <time dateTime={achievement.date}>
            {formatDate(achievement.date, lang)}
          </time>
        )
      }
      lead={achievement.subtitle}
    >
      <TagList tags={achievement.tags} lang={lang} />
      <CoverImage image={cover} alt={achievement.title} />
      {achievement.summary && (
        <p className="border-l-4 border-highlight pl-4 text-lg text-pretty text-foreground">
          {achievement.summary}
        </p>
      )}
      <Prose>
        <RichText data={achievement.body} />
      </Prose>
      <Gallery
        images={achievement.images}
        lang={lang}
        title={achievement.title}
      />
      {videos.length > 0 && (
        <Section title={t('achievements.videos')}>
          <div className="flex flex-col gap-4">
            {videos.map((url) =>
              isPlayable(url) ? (
                // biome-ignore lint/a11y/useMediaCaption: editors upload videos without captions
                <video
                  key={url}
                  controls
                  preload="metadata"
                  className="aspect-video w-full rounded-xl bg-brand-dark"
                >
                  <source src={url} type="video/mp4" />
                  {t('achievements.videoUnsupported')}
                </video>
              ) : (
                <Link
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'max-w-full self-start',
                  })}
                >
                  <PlayIcon data-icon="inline-start" />
                  <span className="truncate">
                    {t('achievements.openVideo')}
                  </span>
                </Link>
              )
            )}
          </div>
        </Section>
      )}
      <BackLink href={localePath(lang, '/achievements')}>
        {t('achievements.backLink')}
      </BackLink>
      <SectionNews tag="awards" lang={lang} />
    </PageShell>
  );
}

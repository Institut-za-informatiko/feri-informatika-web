import { ArrowRightIcon } from 'lucide-react';
import {
  AchievementCard,
  CardGrid,
  NewsCard,
  Section,
} from '@/components/cards';
import { HeroCarousel } from '@/components/client/HeroCarousel';
import { Container } from '@/components/PageShell';
import { ProjectCard } from '@/components/ProjectCard';
import { buttonVariants } from '@/components/ui/button';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { toImage } from '@/lib/media';
import { findAll, findGlobal } from '@/lib/payload';
import type { Achievement, News, Project } from '@/payload-types';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return {
    title: { absolute: `${getTranslations(locale)('site.name')} — FERI` },
  };
}

/** Only populated relations (unpublished picks come back as bare ids). */
const populated = <T,>(list: unknown): T[] =>
  Array.isArray(list) ? list.filter((x): x is T => typeof x === 'object') : [];

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className={buttonVariants({ variant: 'link', size: 'sm' })}>
      {label}
      <ArrowRightIcon data-icon="inline-end" />
    </a>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);

  const [slides, highlighted] = await Promise.all([
    findAll('hero-slides', lang, { sort: 'order' }),
    findGlobal('highlighted', lang, 2),
  ]);
  const news = populated<News>(highlighted.news).slice(0, 6);
  const achievements = populated<Achievement>(highlighted.achievements).slice(
    0,
    3
  );
  const projects = populated<Project>(highlighted.projects).slice(0, 3);

  return (
    <>
      <HeroCarousel
        slides={slides.map((s) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          image: toImage(s.image)?.src,
        }))}
      />

      <Container className="flex flex-col gap-14 py-12">
        {news.length > 0 && (
          <Section
            title={t('home.highlightedNews')}
            action={
              <MoreLink
                href={localePath(lang, '/news')}
                label={t('common.all')}
              />
            }
          >
            <CardGrid>
              {news.map((n) => (
                <NewsCard key={n.id} item={n} lang={lang} />
              ))}
            </CardGrid>
          </Section>
        )}

        {achievements.length > 0 && (
          <Section
            title={t('home.highlightedAchievements')}
            action={
              <MoreLink
                href={localePath(lang, '/achievements')}
                label={t('common.all')}
              />
            }
          >
            <CardGrid>
              {achievements.map((a) => (
                <AchievementCard key={a.id} item={a} lang={lang} />
              ))}
            </CardGrid>
          </Section>
        )}

        {projects.length > 0 && (
          <Section
            title={t('home.highlightedProjects')}
            action={
              <MoreLink
                href={localePath(lang, '/research/projects')}
                label={t('common.all')}
              />
            }
          >
            <CardGrid>
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} lang={lang} />
              ))}
            </CardGrid>
          </Section>
        )}
      </Container>
    </>
  );
}

import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CmsImage } from '@/components/CmsImage';
import { CardGrid, NewsCard } from '@/components/cards';
import { HeroTabs } from '@/components/client/HeroTabs';
import { Container } from '@/components/PageShell';
import { ProjectCard } from '@/components/ProjectCard';
import { buttonVariants } from '@/components/ui/button';
import { getTranslations, type Lang } from '@/i18n/translations';
import { formatDate, getNavLinks, localePath } from '@/i18n/utils';
import { coverOf, toImage } from '@/lib/media';
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
    <Link
      href={href}
      className={buttonVariants({ variant: 'link', size: 'sm' })}
    >
      {label}
      <ArrowRightIcon data-icon="inline-end" />
    </Link>
  );
}

/** Home section title: larger than the inner-page Section, with an optional "all" link. */
function HomeSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl leading-tight font-bold sm:text-4xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);

  const [slides, highlighted, labs] = await Promise.all([
    findAll('hero-slides', lang, { sort: 'order' }),
    findGlobal('highlighted', lang, 2),
    findAll('laboratories', lang, { sort: 'name', depth: 0 }),
  ]);
  const news = populated<News>(highlighted.news).slice(0, 6);
  const [spotlight, ...moreAchievements] = populated<Achievement>(
    highlighted.achievements
  ).slice(0, 3);
  const projects = populated<Project>(highlighted.projects).slice(0, 3);
  const spotlightCover = spotlight && coverOf(spotlight);

  return (
    <>
      <h1 className="sr-only">{t('site.name')}</h1>
      <HeroTabs
        label={t('home.highlights')}
        actions={[
          ...['nav.research', 'nav.about'].flatMap((key) =>
            getNavLinks(lang)
              .filter((n) => n.key === key)
              .map((n) => ({ href: n.href, label: t(n.key) }))
          ),
        ]}
        slides={slides.map((s) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          image: toImage(s.image)?.src,
        }))}
      />

      {labs.length > 0 && (
        <section className="bg-brand-dark py-20 text-primary-foreground sm:py-24">
          <Container className="flex flex-col gap-12">
            <div className="grid items-end gap-6 md:grid-cols-2 md:gap-10">
              <h2 className="text-4xl leading-none font-bold sm:text-5xl">
                {t('home.research.title')}
              </h2>
              <p className="text-lg text-pretty text-primary-foreground/80">
                {t('home.research.lead')}
              </p>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/20 sm:grid-cols-2 lg:grid-cols-3">
              {labs.map((lab, i) => (
                <li key={lab.id} className="flex">
                  <Link
                    href={localePath(lang, `/laboratories/${lab.slug}`)}
                    className="group flex w-full flex-col justify-between gap-10 bg-brand-dark p-7 transition-colors hover:bg-primary focus-visible:bg-primary focus-visible:outline-none"
                  >
                    <span className="font-mono text-sm text-primary-foreground/70 group-hover:text-highlight group-focus-visible:text-highlight">
                      {String(i + 1).padStart(2, '0')}
                      {lab.acronym && ` — ${lab.acronym}`}
                    </span>
                    <span className="flex flex-col gap-2">
                      <span className="font-heading text-2xl leading-tight font-bold text-balance">
                        {lab.name}
                      </span>
                      {lab.researchAreas && lab.researchAreas.length > 0 && (
                        <span className="text-sm text-primary-foreground/75">
                          {lab.researchAreas
                            .slice(0, 3)
                            .map((a) => a.area)
                            .join(' · ')}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="flex">
                <Link
                  href={localePath(lang, '/laboratories')}
                  className="flex w-full flex-col justify-between gap-10 bg-highlight p-7 text-highlight-foreground transition-colors hover:bg-highlight/90 focus-visible:ring-3 focus-visible:ring-primary-foreground focus-visible:outline-none focus-visible:ring-inset"
                >
                  <span className="font-mono text-sm">
                    {t('home.research.all')}
                  </span>
                  <span className="flex items-center justify-between gap-3 font-heading text-2xl leading-tight font-bold">
                    {t('home.research.cta')}
                    <ArrowRightIcon className="size-7 shrink-0" />
                  </span>
                </Link>
              </li>
            </ul>
          </Container>
        </section>
      )}

      <Container className="flex flex-col gap-20 py-20 sm:gap-24 sm:py-24">
        {news.length > 0 && (
          <HomeSection
            title={t('home.highlightedNews')}
            action={
              <MoreLink
                href={localePath(lang, '/news')}
                label={t('home.allNews')}
              />
            }
          >
            <CardGrid>
              {news.map((n) => (
                <NewsCard key={n.id} item={n} lang={lang} />
              ))}
            </CardGrid>
          </HomeSection>
        )}

        {spotlight && (
          <section className="grid overflow-hidden rounded-3xl bg-card md:grid-cols-[1.2fr_1fr]">
            <div className="relative min-h-72 bg-muted md:min-h-96">
              {spotlightCover && (
                <CmsImage
                  src={spotlightCover}
                  alt=""
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-5 p-7 sm:p-12">
              <p className="self-start rounded-full bg-highlight px-3 py-1.5 font-mono text-sm text-highlight-foreground">
                {t('home.achievement')}
                {spotlight.date && (
                  <>
                    {' · '}
                    <time dateTime={spotlight.date}>
                      {formatDate(spotlight.date, lang)}
                    </time>
                  </>
                )}
              </p>
              <h2 className="text-3xl leading-tight font-bold text-balance sm:text-4xl">
                <Link
                  href={localePath(lang, `/achievements/${spotlight.slug}`)}
                  className="rounded-sm underline-offset-4 hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {spotlight.title}
                </Link>
              </h2>
              {(spotlight.subtitle ?? spotlight.summary) && (
                <p className="text-pretty text-muted-foreground">
                  {spotlight.subtitle ?? spotlight.summary}
                </p>
              )}
              {moreAchievements.length > 0 && (
                <ul className="flex flex-col border-t">
                  {moreAchievements.map((a) => (
                    <li key={a.id} className="border-b">
                      <Link
                        href={localePath(lang, `/achievements/${a.slug}`)}
                        className="flex items-center justify-between gap-3 py-3 font-medium transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                      >
                        {a.title}
                        <ArrowRightIcon className="size-4 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <MoreLink
                href={localePath(lang, '/achievements')}
                label={t('home.allAchievements')}
              />
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <HomeSection
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
          </HomeSection>
        )}

        <section className="grid items-center gap-8 rounded-3xl bg-highlight p-7 text-highlight-foreground sm:p-14 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm tracking-widest uppercase">
              {t('studies.title')}
            </p>
            <h2 className="text-4xl leading-none font-bold text-balance sm:text-5xl">
              {t('home.study.title')}
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-lg text-pretty">{t('home.study.lead')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={localePath(lang, '/studies/programmes')}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 font-semibold text-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-foreground/40 focus-visible:outline-none"
              >
                {t('studies.programmes.title')}
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href={localePath(lang, '/studies/student-projects')}
                className="inline-flex h-12 items-center rounded-full border border-foreground px-6 font-semibold transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-foreground/40 focus-visible:outline-none"
              >
                {t('studies.sidebar.students')}
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}

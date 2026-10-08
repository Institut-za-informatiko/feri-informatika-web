import { CalendarIcon } from 'lucide-react';
import { type ReactNode, Suspense } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getTranslations,
  type Lang,
  type TranslationKey,
} from '@/i18n/translations';
import { formatDate, localePath } from '@/i18n/utils';
import { coverOf, type CmsImage as Img, toImages } from '@/lib/media';
import { byDateDesc, findAll } from '@/lib/payload';
import type { Achievement, News } from '@/payload-types';
import { CmsImage } from './CmsImage';
import { FilterableGrid } from './client/FilterableGrid';
import { GalleryDialog } from './client/GalleryDialog';

export const TAGS = [
  'student',
  'conference',
  'scientific',
  'professional',
  'project',
  'awards',
  'interest-groups',
] as const;

export const tagLabel = (tag: string, lang: Lang) =>
  getTranslations(lang)(`tag.${tag}` as TranslationKey);

/** Responsive card grid: one column on phones, up to three on desktop. */
export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

/** Image card used for news and achievements everywhere (home, lists, "latest news"). */
export function ImageCard({
  href,
  title,
  cover,
  date,
  lang,
  children,
}: {
  href: string;
  title: string;
  cover?: Img;
  date?: string | null;
  lang: Lang;
  children?: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group flex w-full rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card className="w-full pt-0 transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {cover ? (
            <CmsImage
              src={cover}
              alt=""
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center font-heading text-lg font-semibold text-primary/40">
              II · FERI
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-highlight" />
        </div>
        <CardHeader className="gap-2">
          {date && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarIcon className="size-3.5" />
              <time dateTime={date}>{formatDate(date, lang)}</time>
            </p>
          )}
          <CardTitle className="text-lg leading-snug group-hover:text-primary">
            {title}
          </CardTitle>
          {children && (
            <CardDescription className="line-clamp-3">
              {children}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </a>
  );
}

export function NewsCard({ item, lang }: { item: News; lang: Lang }) {
  return (
    <ImageCard
      href={localePath(lang, `/news/${item.slug}`)}
      title={item.title}
      cover={coverOf(item)}
      date={item.date}
      lang={lang}
    >
      {item.summary}
    </ImageCard>
  );
}

export function AchievementCard({
  item,
  lang,
}: {
  item: Achievement;
  lang: Lang;
}) {
  return (
    <ImageCard
      href={localePath(lang, `/achievements/${item.slug}`)}
      title={item.title}
      cover={coverOf(item)}
      date={item.date}
      lang={lang}
    >
      {item.subtitle ?? item.summary}
    </ImageCard>
  );
}

/** List with a tag filter. Without JS (or before hydration) every item is shown. */
export function TagFilteredGrid({
  lang,
  items,
  emptyLabel,
}: {
  lang: Lang;
  items: { key: number; tags?: string[] | null; node: ReactNode }[];
  emptyLabel: string;
}) {
  const t = getTranslations(lang);
  const plain = (
    <CardGrid>
      {items.map((i) => (
        <div key={i.key} className="flex">
          {i.node}
        </div>
      ))}
    </CardGrid>
  );
  return (
    <Suspense fallback={plain}>
      <FilterableGrid
        items={items.map((i) => ({
          key: i.key,
          tags: i.tags ?? [],
          node: i.node,
        }))}
        tags={TAGS.map((tag) => ({ value: tag, label: tagLabel(tag, lang) }))}
        allLabel={t('common.all')}
        filterLabel={t('common.filter')}
        emptyLabel={emptyLabel}
      />
    </Suspense>
  );
}

/** "Latest news" strip: the three newest news items with a tag. */
export async function SectionNews({
  tag,
  label,
  lang,
}: {
  tag: string;
  label?: string;
  lang: Lang;
}) {
  const t = getTranslations(lang);
  const news = (
    await findAll('news', lang, { where: { tags: { contains: tag } } })
  )
    .sort(byDateDesc)
    .slice(0, 3);
  if (news.length === 0) return null;
  return (
    <Section title={label ?? t('common.latestNews')}>
      <CardGrid>
        {news.map((n) => (
          <NewsCard key={n.id} item={n} lang={lang} />
        ))}
      </CardGrid>
    </Section>
  );
}

/** Titled block within a page. */
export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4 border-b pb-3">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TagList({
  tags,
  lang,
}: {
  tags?: string[] | null;
  lang: Lang;
}) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tagLabel(tag, lang)}
        </Badge>
      ))}
    </div>
  );
}

export function Gallery({
  images,
  lang,
  title,
}: {
  images: unknown;
  lang: Lang;
  title: string;
}) {
  const t = getTranslations(lang);
  const list = toImages(images);
  if (list.length === 0) return null;
  return (
    <Section title={t('news.gallery')}>
      <GalleryDialog
        images={list}
        title={title}
        openLabel={t('gallery.open')}
        ofLabel={t('gallery.of')}
      />
    </Section>
  );
}

/** Large cover image at the top of a detail page. */
export function CoverImage({ image, alt }: { image?: Img; alt: string }) {
  if (!image) return null;
  return (
    <div className="flex justify-center overflow-hidden rounded-xl bg-muted">
      <CmsImage
        src={image}
        alt={alt}
        sizes="(max-width: 1024px) 100vw, 900px"
        loading="eager"
        className="max-h-[32rem] w-auto object-contain"
      />
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardContent className="text-center text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

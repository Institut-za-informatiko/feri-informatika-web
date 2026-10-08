import { cn } from 'cn';
import type { ReactNode } from 'react';
import { getTranslations, type Lang } from '@/i18n/translations';
import { SectionNav, type SidebarLink } from './client/SectionNav';

export type { SidebarLink };

type Props = {
  lang: Lang;
  title: string;
  /** Short text under the title. */
  lead?: ReactNode;
  /** Small line above the title (date, type, …). */
  eyebrow?: ReactNode;
  sidebarTitle?: string;
  sidebarLinks?: SidebarLink[];
  /** Wider content column without a sidebar (lists of cards). */
  wide?: boolean;
  children: ReactNode;
};

/** Sidebar heading from the section the links belong to. */
function guessSidebarTitle(lang: Lang, links: SidebarLink[], title: string) {
  const t = getTranslations(lang);
  const paths = links.flatMap((l) => [
    l.href,
    ...(l.children ?? []).map((c) => c.href),
  ]);
  const has = (s: string) => paths.some((p) => p.includes(s));
  if (has('/research/')) return t('research.title');
  if (has('/studies/')) return t('studies.title');
  if (has('/conferences')) return t('conferences.title');
  if (has('/industry')) return t('industry.title');
  if (has('/laboratories') || has('/interest-groups') || has('/staff'))
    return t('about.title');
  return title;
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}>
      {children}
    </div>
  );
}

/** Page title with the UM accent bar. */
export function PageHeader({
  title,
  lead,
  eyebrow,
}: {
  title: string;
  lead?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && (
        <div className="text-sm text-muted-foreground">{eyebrow}</div>
      )}
      <h1 className="text-3xl font-bold text-balance text-foreground sm:text-4xl">
        {title}
      </h1>
      <div className="h-1 w-14 rounded-full bg-highlight" />
      {lead && (
        <p className="max-w-3xl text-lg text-pretty text-muted-foreground">
          {lead}
        </p>
      )}
    </header>
  );
}

/** Standard page: title, optional section navigation, content. */
export function PageShell({
  lang,
  title,
  lead,
  eyebrow,
  sidebarTitle,
  sidebarLinks = [],
  wide,
  children,
}: Props) {
  const t = getTranslations(lang);
  const hasNav = sidebarLinks.length > 0;
  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <div
        className={cn(
          'grid gap-8',
          hasNav && 'lg:grid-cols-[15rem_minmax(0,1fr)]'
        )}
      >
        {hasNav && (
          <SectionNav
            title={sidebarTitle ?? guessSidebarTitle(lang, sidebarLinks, title)}
            links={sidebarLinks}
            menuLabel={t('section.menu')}
          />
        )}
        <div
          className={cn(
            'flex min-w-0 flex-col gap-8',
            !hasNav && !wide && 'max-w-4xl'
          )}
        >
          <PageHeader title={title} lead={lead} eyebrow={eyebrow} />
          {children}
        </div>
      </div>
    </Container>
  );
}

/** Rich text / long-form content. */
export function Prose({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'prose max-w-none prose-neutral prose-headings:font-heading prose-a:text-primary prose-img:rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';
import { SectionNews } from '@/components/cards';
import { PageShell, Prose, type SidebarLink } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import type { Lang } from '@/i18n/translations';
import { findBySlug } from '@/lib/payload';

/** Metadata for a page from the `pages` collection (slug = URL path without /en). */
export async function cmsPageMetadata(slug: string, lang: Lang) {
  const page = await findBySlug('pages', slug, lang);
  return { title: page.title, description: page.lead ?? undefined };
}

/** Free-standing text page edited in the CMS, with optional extra content below the text. */
export async function CmsPage({
  slug,
  lang,
  sidebarLinks,
  newsTag,
  children,
}: {
  slug: string;
  lang: Lang;
  sidebarLinks?: SidebarLink[];
  /** Tag of the "latest news" strip under the page. */
  newsTag?: string;
  children?: ReactNode;
}) {
  const page = await findBySlug('pages', slug, lang);
  return (
    <PageShell
      lang={lang}
      title={page.title}
      lead={page.lead ?? undefined}
      sidebarLinks={sidebarLinks}
    >
      {/* RichText wraps the blocks in a div, so prose's own first/last-child margin reset misses them. */}
      {page.body ? (
        <Prose className="wrap-break-word [&>*>:first-child]:mt-0 [&>*>:last-child]:mb-0">
          <RichText data={page.body} />
        </Prose>
      ) : null}
      {children}
      {newsTag && <SectionNews tag={newsTag} lang={lang} />}
    </PageShell>
  );
}

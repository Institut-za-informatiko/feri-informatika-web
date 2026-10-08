/** Public path of a document per collection/global. Used by Preview and Live Preview. */
const collectionPaths: Partial<Record<string, (slug: string) => string>> = {
  news: (s) => `/news/${s}`,
  achievements: (s) => `/achievements/${s}`,
  staff: (s) => `/staff/${s}`,
  projects: (s) => `/research/projects/${s}`,
  laboratories: (s) => `/laboratories/${s}`,
  conferences: (s) => `/conferences/${s}`,
  'interest-groups': (s) => `/interest-groups/${s}`,
  'study-programmes': (s) => `/studies/programmes/${s}`,
  'student-projects': (s) => `/studies/student-projects/${s}`,
  pages: (s) => `/${s}`,
};

const globalPaths: Partial<Record<string, string>> = {
  about: '/about',
  'research-group': '/research/group',
  highlighted: '/',
};

const withLocale = (path: string, locale?: string) =>
  locale === 'en' ? `/en${path === '/' ? '' : path}` : path;

/** URL of the draft-mode entry route, which then redirects to the page itself. */
const previewUrl = (path: string, locale?: string) =>
  `/next/preview?${new URLSearchParams({
    path: withLocale(path, locale),
    secret: process.env.PREVIEW_SECRET ?? '',
  })}`;

export const hasCollectionPreview = (collection: string) =>
  collection in collectionPaths;

export function collectionPreviewUrl(
  collection: string,
  doc: Record<string, unknown>,
  locale?: string
) {
  const toPath = collectionPaths[collection];
  return toPath && typeof doc?.slug === 'string'
    ? previewUrl(toPath(doc.slug), locale)
    : null;
}

export function globalPreviewUrl(global: string, locale?: string) {
  const path = globalPaths[global];
  return path ? previewUrl(path, locale) : null;
}

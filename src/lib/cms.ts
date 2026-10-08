import type { Loader } from 'astro/loaders';

/**
 * Content comes from the Payload CMS (cms/) at build time. The public API only returns
 * published documents, so the build needs no credentials.
 */
export const CMS_URL = (process.env.CMS_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  ''
);

export type Locale = 'sl' | 'en';
type Doc = Record<string, any>;

async function get(path: string): Promise<any> {
  const res = await fetch(`${CMS_URL}/api/${path}`);
  if (!res.ok)
    throw new Error(`CMS ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function fetchCollection(
  slug: string,
  locale: Locale
): Promise<Doc[]> {
  const data = await get(`${slug}?pagination=false&depth=2&locale=${locale}`);
  return data.docs;
}

export async function fetchGlobal(slug: string, locale: Locale): Promise<Doc> {
  return get(`globals/${slug}?depth=1&locale=${locale}`);
}

/**
 * Media and links come back with the CMS origin. The site proxies /api to the CMS itself,
 * so strip the origin and keep paths same-origin.
 */
const sameOrigin = (url: string | null | undefined) =>
  url ? url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '') : undefined;

export const htmlSameOrigin = (html: string | null | undefined) =>
  (html ?? '').replace(
    /(src|href)="https?:\/\/[^/"]+(\/api\/media\/)/g,
    '$1="$2'
  );

export type CmsImage = {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  srcset?: string;
};

/** Payload media doc → what CmsImage.astro renders (`src` kept for code that read ImageMetadata.src). */
export function image(
  media: Doc | number | null | undefined
): CmsImage | undefined {
  if (!media || typeof media !== 'object' || !media.url) return undefined;
  const variants = Object.values(media.sizes ?? {}) as Doc[];
  const srcset = variants
    .filter((v) => v?.url && v.width)
    .map((v) => `${sameOrigin(v.url)} ${v.width}w`)
    .concat(media.width ? [`${sameOrigin(media.url)} ${media.width}w`] : [])
    .join(', ');
  return {
    src: sameOrigin(media.url) as string,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    alt: media.alt ?? undefined,
    srcset: srcset || undefined,
  };
}

export const images = (list: unknown) =>
  Array.isArray(list)
    ? (list.map(image).filter(Boolean) as CmsImage[])
    : undefined;

/** Drops null/empty values so optional zod fields stay optional. */
export const clean = <T extends Doc>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== ''
    )
  ) as T;

type Mapper = (doc: Doc) => Doc;

/** Astro content loader over one Payload collection. Entries keep the slug as id, so URLs match. */
export function payloadLoader(
  slug: string,
  locale: Locale,
  map: Mapper
): Loader {
  return {
    name: `payload:${slug}:${locale}`,
    load: async ({ store, parseData, logger }) => {
      const docs = await fetchCollection(slug, locale);
      store.clear();
      for (const doc of docs) {
        const id = doc.slug ?? String(doc.id);
        const data = await parseData({ id, data: clean(map(doc)) });
        store.set({
          id,
          data,
          rendered: { html: htmlSameOrigin(doc.bodyHtml) },
        });
      }
      logger.info(`${docs.length} ${slug} (${locale})`);
    },
  };
}

/** Astro content loader exposing one Payload global as a single entry with a fixed id. */
export function payloadGlobalLoader(
  slug: string,
  id: string,
  locale: Locale,
  map: Mapper
): Loader {
  return {
    name: `payload-global:${slug}:${locale}`,
    load: async ({ store, parseData }) => {
      const doc = await fetchGlobal(slug, locale);
      store.clear();
      const data = await parseData({ id, data: clean(map(doc)) });
      store.set({ id, data, rendered: { html: htmlSameOrigin(doc.bodyHtml) } });
    },
  };
}

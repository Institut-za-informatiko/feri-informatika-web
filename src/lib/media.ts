import type { Media } from '@/payload-types';

/** What CmsImage renders: the original plus Payload's pre-generated sizes as a srcset. */
export type CmsImage = {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  srcset?: string;
};

/**
 * Payload returns absolute media URLs (serverURL). The site and the CMS share an origin,
 * so keep them relative: the same markup works locally, in previews and in production.
 */
export const sameOrigin = (url: string) =>
  url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '');

export function toImage(media: unknown): CmsImage | undefined {
  if (!media || typeof media !== 'object') return undefined;
  const m = media as Media;
  if (!m.url) return undefined;
  const variants = Object.values(m.sizes ?? {}).filter(
    (v): v is { url: string; width: number } => Boolean(v?.url && v.width)
  );
  const srcset = [
    ...variants.map((v) => `${sameOrigin(v.url)} ${v.width}w`),
    ...(m.width ? [`${sameOrigin(m.url)} ${m.width}w`] : []),
  ].join(', ');
  return {
    src: sameOrigin(m.url),
    width: m.width ?? undefined,
    height: m.height ?? undefined,
    alt: m.alt ?? undefined,
    srcset: srcset || undefined,
  };
}

export const toImages = (list: unknown): CmsImage[] =>
  Array.isArray(list)
    ? list.map(toImage).filter((i): i is CmsImage => Boolean(i))
    : [];

/** Cards fall back to the first gallery image when there is no cover. */
export const coverOf = (doc: { coverImage?: unknown; images?: unknown }) =>
  toImage(doc.coverImage) ?? toImages(doc.images)[0];

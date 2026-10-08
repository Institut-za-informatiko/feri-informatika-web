import config from '@payload-config';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import {
  type CollectionSlug,
  type DataFromCollectionSlug,
  type DataFromGlobalSlug,
  type GlobalSlug,
  getPayload,
  type Where,
} from 'payload';
import { cache } from 'react';
import type { Lang } from '@/i18n/translations';

/**
 * Server-side reads through Payload's Local API (no HTTP round trip).
 * In draft mode (Live Preview / Preview button) editors see unpublished changes;
 * otherwise only published documents are returned.
 */
const client = cache(() => getPayload({ config }));

const isDraft = async () => (await draftMode()).isEnabled;

type ListOptions = { where?: Where; sort?: string; depth?: number };

export const findAll = cache(
  async <S extends CollectionSlug>(
    collection: S,
    lang: Lang,
    { where, sort, depth = 1 }: ListOptions = {}
  ): Promise<DataFromCollectionSlug<S>[]> => {
    const payload = await client();
    const draft = await isDraft();
    const { docs } = await payload.find({
      collection,
      locale: lang,
      fallbackLocale: 'sl',
      draft,
      overrideAccess: draft,
      pagination: false,
      depth,
      where,
      sort,
    });
    return docs as DataFromCollectionSlug<S>[];
  }
);

/** One document by slug, or the Next 404 page. */
export const findBySlug = cache(
  async <S extends CollectionSlug>(
    collection: S,
    slug: string,
    lang: Lang,
    depth = 1
  ): Promise<DataFromCollectionSlug<S>> => {
    const docs = await findAll(collection, lang, {
      where: { slug: { equals: decodeURIComponent(slug) } },
      depth,
    });
    if (!docs[0]) notFound();
    return docs[0];
  }
);

export const findGlobal = cache(
  async <S extends GlobalSlug>(
    slug: S,
    lang: Lang,
    depth = 1
  ): Promise<DataFromGlobalSlug<S>> => {
    const payload = await client();
    const draft = await isDraft();
    return (await payload.findGlobal({
      slug,
      locale: lang,
      fallbackLocale: 'sl',
      draft,
      overrideAccess: draft,
      depth,
    })) as DataFromGlobalSlug<S>;
  }
);

export const byDateDesc = <T extends { date?: string | null }>(a: T, b: T) =>
  new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();

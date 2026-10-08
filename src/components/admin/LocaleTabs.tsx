'use client';

import {
  useConfig,
  useDocumentInfo,
  useLocale,
  useRouteTransition,
  useTranslation,
} from '@payloadcms/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Language tabs in the document header: switch the edited locale in one click and see which
 * language still lacks a translation. Live Preview follows the selected locale.
 */
export function LocaleTabs({ field }: { field?: string }) {
  const { config } = useConfig();
  const { id, collectionSlug, globalSlug } = useDocumentInfo();
  const locale = useLocale();
  const router = useRouter();
  const { startRouteTransition } = useRouteTransition();
  const { i18n } = useTranslation();
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  const locales = config.localization ? config.localization.locales : [];
  // Which field shows whether a locale is translated: given per entity in payload.config.ts,
  // else the collection's title field.
  const titleField =
    field ??
    (collectionSlug
      ? config.collections.find((c) => c.slug === collectionSlug)?.admin
          ?.useAsTitle
      : undefined);

  // A locale counts as translated when its title has its own value (no fallback).
  useEffect(() => {
    if (!titleField || (!id && !globalSlug)) return;
    const base = globalSlug
      ? `${config.routes.api}/globals/${globalSlug}`
      : `${config.routes.api}/${collectionSlug}/${id}`;
    let cancelled = false;
    Promise.all(
      locales.map(async (l) => {
        const res = await fetch(
          `${base}?locale=${l.code}&fallback-locale=none&depth=0&draft=true`,
          { credentials: 'include' }
        );
        const doc = res.ok ? await res.json() : null;
        return [l.code, !doc?.[titleField]] as const;
      })
    )
      .then((entries) => !cancelled && setMissing(Object.fromEntries(entries)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // Re-check after switching, so a freshly saved translation clears its marker.
  }, [
    id,
    globalSlug,
    collectionSlug,
    titleField,
    locale.code,
    config.routes.api,
    locales,
  ]);

  if (locales.length < 2) return null;

  const select = (code: string) => {
    if (code === locale.code) return;
    const params = new URLSearchParams(window.location.search);
    params.set('locale', code);
    startRouteTransition(() => router.push(`?${params}`));
  };

  const missingLabel =
    i18n.language === 'en' ? 'not translated yet' : 'še ni prevoda';

  return (
    <div
      role="tablist"
      aria-label={i18n.language === 'en' ? 'Content language' : 'Jezik vsebine'}
      style={{
        display: 'inline-flex',
        gap: 2,
        padding: 2,
        borderRadius: 'var(--style-radius-m)',
        background: 'var(--theme-elevation-100)',
        marginInlineEnd: 'calc(var(--base) * 0.5)',
      }}
    >
      {locales.map((l) => {
        const active = l.code === locale.code;
        const label =
          typeof l.label === 'string' ? l.label : l.code.toUpperCase();
        return (
          <button
            key={l.code}
            type="button"
            role="tab"
            aria-selected={active}
            title={missing[l.code] ? `${label}: ${missingLabel}` : label}
            onClick={() => select(l.code)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              border: 0,
              cursor: active ? 'default' : 'pointer',
              padding: '4px 12px',
              borderRadius: 'calc(var(--style-radius-m) - 2px)',
              fontWeight: active ? 600 : 400,
              background: active ? 'var(--theme-elevation-0)' : 'transparent',
              color: active
                ? 'var(--theme-text)'
                : 'var(--theme-elevation-600)',
              boxShadow: active ? '0 1px 2px rgb(0 0 0 / 0.12)' : 'none',
            }}
          >
            {label}
            {missing[l.code] && (
              <span
                role="img"
                aria-label={missingLabel}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--theme-warning-500)',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

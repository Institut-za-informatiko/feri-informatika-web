'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Item = { key: string | number; tags: string[]; node: ReactNode };

/**
 * Card grid with a tag filter. The selected tag lives in `?tag=`, so a filtered list can
 * be shared, and the language switch (which keeps the query) lands on the same filter.
 */
export function FilterableGrid({
  items,
  tags,
  allLabel,
  filterLabel,
  emptyLabel,
}: {
  items: Item[];
  tags: { value: string; label: string }[];
  allLabel: string;
  filterLabel: string;
  emptyLabel: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [tag, setTag] = useState(params.get('tag') ?? '');

  useEffect(() => setTag(params.get('tag') ?? ''), [params]);

  const select = (value: string) => {
    setTag(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set('tag', value);
    else url.searchParams.delete('tag');
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  };

  const visible = tag ? items.filter((i) => i.tags.includes(tag)) : items;

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <ToggleGroup
          aria-label={filterLabel}
          variant="outline"
          size="sm"
          value={[tag]}
          onValueChange={(v) => select((v as string[])[0] ?? '')}
          className="flex-nowrap sm:flex-wrap"
        >
          <ToggleGroupItem value="">{allLabel}</ToggleGroupItem>
          {tags.map((t) => (
            <ToggleGroupItem key={t.value} value={t.value}>
              {t.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => (
            <div key={i.key} className="flex">
              {i.node}
            </div>
          ))}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>{emptyLabel}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

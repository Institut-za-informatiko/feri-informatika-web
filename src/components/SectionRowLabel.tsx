'use client';

import { useRowLabel } from '@payloadcms/ui';

export const SectionRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ heading?: string }>();
  return <span>{data?.heading || `Sekcija ${(rowNumber ?? 0) + 1}`}</span>;
};

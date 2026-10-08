'use client';

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

/**
 * Server-side Live Preview (Payload docs): when the editor saves in the admin panel,
 * re-render the route so draft-mode data is fetched again.
 */
export function RefreshOnSave() {
  const router = useRouter();
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      // The admin panel is served from the same origin as the site.
      serverURL={typeof window === 'undefined' ? '' : window.location.origin}
    />
  );
}

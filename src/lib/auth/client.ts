'use client';

import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/** Browser client for the CMS sign-in (same origin, Better Auth mounted at /api/auth). */
export const authClient = createAuthClient({
  basePath: '/api/auth',
  plugins: [magicLinkClient()],
});

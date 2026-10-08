'use client';

import { passkeyClient } from '@better-auth/passkey/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/** Browser client for CMS sign-in: emailed code and passkeys (same origin, mounted at /api/auth). */
export const authClient = createAuthClient({
  basePath: '/api/auth',
  plugins: [emailOTPClient(), passkeyClient()],
});

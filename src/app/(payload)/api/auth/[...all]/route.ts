import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth/server';

// Better Auth (magic-link sign-in, sessions). More specific than Payload's api/[...slug],
// so /api/auth/* is handled here and everything else under /api stays with Payload.
export const { GET, POST } = toNextJsHandler(auth);

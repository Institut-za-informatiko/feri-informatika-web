import type { AuthStrategy } from 'payload';
import { auth } from './server';

/**
 * Payload auth strategy backed by the Better Auth session cookie (pattern from
 * delmaredigital/payload-better-auth). The Payload user with the same email is looked up on
 * every request, so removing or deactivating someone in the CMS ends their access at once.
 */
export const betterAuthStrategy: AuthStrategy = {
  name: 'better-auth',
  authenticate: async ({ headers, payload }) => {
    const session = await auth.api.getSession({ headers });
    if (!session) return { user: null };

    const { docs } = await payload.find({
      collection: 'users',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: {
        email: { equals: session.user.email.toLowerCase() },
        active: { not_equals: false },
      },
    });
    const user = docs[0];
    return {
      user: user
        ? { ...user, collection: 'users', _strategy: 'better-auth' }
        : null,
    };
  },
};

import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
import { Pool } from 'pg';
import { sendMagicLinkEmail } from './email';

/**
 * Passwordless sign-in for the CMS. Better Auth issues the one-time links and the session
 * cookie; who may sign in, and with which role, is decided by the Payload `users` collection
 * (see isAllowedEmail and ./strategy.ts).
 */

const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

// One pool per process, also across dev hot reloads.
const globalForPool = globalThis as unknown as { betterAuthPool?: Pool };
const pool =
  globalForPool.betterAuthPool ??
  new Pool({ connectionString: process.env.DATABASE_URI, max: 5 });
globalForPool.betterAuthPool = pool;

/** An address may sign in only if an administrator added it as an active CMS user. */
export async function isAllowedEmail(email: string): Promise<boolean> {
  // Imported lazily: the Payload config itself imports this module (via the auth strategy).
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ]);
  const payload = await getPayload({ config });
  const { totalDocs } = await payload.count({
    collection: 'users',
    overrideAccess: true,
    where: {
      email: { equals: email.trim().toLowerCase() },
      active: { not_equals: false },
    },
  });
  return totalDocs > 0;
}

export const auth = betterAuth({
  appName: 'Inštitut za informatiko — CMS',
  baseURL: serverURL,
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [serverURL],
  database: pool,
  // Prefixed tables, so they never collide with Payload's own `users`.
  user: { modelName: 'ba_user' },
  session: {
    modelName: 'ba_session',
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  account: { modelName: 'ba_account' },
  verification: { modelName: 'ba_verification' },
  emailAndPassword: { enabled: false },
  rateLimit: {
    enabled: true,
    customRules: {
      '/sign-in/magic-link': { window: 5 * 60, max: 5 },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Defense in depth: links are only sent to allowed addresses, but never let
        // anyone else end up with an account either.
        before: async (user) =>
          (await isAllowedEmail(user.email)) ? { data: user } : false,
      },
    },
  },
  plugins: [
    magicLink({
      expiresIn: 15 * 60,
      sendMagicLink: async ({ email, url }) => {
        // Unknown addresses get the same response as known ones (no account enumeration).
        if (!(await isAllowedEmail(email))) return;
        await sendMagicLinkEmail({ to: email, url });
      },
    }),
    // Lets server actions / route handlers set the session cookie (Better Auth docs, Next.js).
    nextCookies(),
  ],
});

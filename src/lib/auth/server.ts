import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins';
import { Pool } from 'pg';
import { sendSignInCodeEmail } from './email';

/**
 * Passwordless sign-in for the CMS. Better Auth emails a one-time code and issues the session
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

/** Short device name for the passkey list ("Mac", "iPhone", …) from the registering browser. */
function deviceLabel(userAgent?: string | null) {
  const ua = userAgent ?? '';
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) return 'Android';
  if (/Macintosh/.test(ua)) return 'Mac';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Passkey';
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
      '/email-otp/send-verification-otp': { window: 5 * 60, max: 5 },
      '/sign-in/email-otp': { window: 5 * 60, max: 10 },
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
    // A typed code instead of a link: Microsoft Defender (UM mail) opens and clicks every
    // link in an email, which used up single-use links before the person could.
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      allowedAttempts: 3,
      storeOTP: 'hashed',
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== 'sign-in') return;
        // Unknown addresses get the same response as known ones (no account enumeration).
        if (!(await isAllowedEmail(email))) return;
        await sendSignInCodeEmail({ to: email, code: otp });
      },
    }),
    // Passkeys are added after a first sign-in with a code and are bound to this host name.
    // The authenticator stores the account as the user's email (the client must not send a
    // `name`: the plugin would use it as the WebAuthn user name); the label shown in the CMS
    // is set here instead.
    passkey({
      rpID: new URL(serverURL).hostname,
      rpName: 'Inštitut za informatiko — CMS',
      origin: serverURL,
      schema: { passkey: { modelName: 'ba_passkey' } },
      registration: {
        afterVerification: ({ ctx }) => ({
          name: deviceLabel(ctx.headers?.get('user-agent')),
        }),
      },
    }),
    // Lets server actions / route handlers set the session cookie (Better Auth docs, Next.js).
    nextCookies(),
  ],
});

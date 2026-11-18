import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Password gate for the whole site while it is a preview. Active only when SITE_PASSWORD
 * is set; the cookie holds a hash of the password, so changing it signs everyone out.
 */
export const GATE_COOKIE = 'site-gate';
export const GATE_PATH = '/gate';

const password = () => process.env.SITE_PASSWORD || '';

export const gateEnabled = () => password() !== '';

export const gateToken = () =>
  createHash('sha256').update(`site-gate:${password()}`).digest('hex');

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const validToken = (value: string | undefined) =>
  !!value && same(value, gateToken());

export const validPassword = (value: string) =>
  gateEnabled() && same(value.normalize('NFC'), password().normalize('NFC'));

/** Where to go after unlocking: only paths on this site. */
export const safeNext = (value: unknown) =>
  typeof value === 'string' && /^\/(?![/\\])/.test(value) ? value : '/';

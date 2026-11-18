'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  GATE_COOKIE,
  GATE_PATH,
  gateToken,
  safeNext,
  validPassword,
} from '@/lib/site-gate';

export async function unlock(form: FormData) {
  const next = safeNext(form.get('next'));
  const value = form.get('password');
  if (typeof value !== 'string' || !validPassword(value)) {
    redirect(`${GATE_PATH}?error=1&next=${encodeURIComponent(next)}`);
  }
  (await cookies()).set(GATE_COOKIE, gateToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect(next);
}

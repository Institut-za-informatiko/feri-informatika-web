import { type NextRequest, NextResponse } from 'next/server';
import {
  GATE_COOKIE,
  GATE_PATH,
  gateEnabled,
  validToken,
} from '@/lib/site-gate';

/** Paths that are not localized pages: the CMS, the kiosk, the gate and public files. */
const NOT_LOCALIZED =
  /^\/(?:(?:admin|api|next|logos|assets|kiosk|gate)(?:\/|$)|favicon\.|robots\.txt|healthz)/;

/**
 * 1. With SITE_PASSWORD set, everything except the gate, /healthz and the logos needs the gate cookie.
 * 2. Slovenian pages have no URL prefix (/news/x), English ones live under /en/news/x.
 *    Both are served by app/(frontend)/[locale]; un-prefixed paths are rewritten to /sl/….
 *    (In production the proxy also sees the rewritten /sl/… request, so it must pass through.)
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    gateEnabled() &&
    pathname !== GATE_PATH &&
    pathname !== '/healthz' &&
    !pathname.startsWith('/logos/') &&
    !validToken(request.cookies.get(GATE_COOKIE)?.value)
  ) {
    if (pathname.startsWith('/api/') || request.method !== 'GET') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = GATE_PATH;
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (NOT_LOCALIZED.test(pathname) || /^\/(en|sl)(\/|$)/.test(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/sl${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next's own build files (the gate page needs them).
  matcher: ['/((?!_next/).*)'],
};

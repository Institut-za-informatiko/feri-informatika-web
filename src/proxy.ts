import { type NextRequest, NextResponse } from 'next/server';

/**
 * Slovenian pages have no URL prefix (/news/x), English ones live under /en/news/x.
 * Both are served by app/(frontend)/[locale]; un-prefixed paths are rewritten to /sl/….
 * (In production the proxy also sees the rewritten /sl/… request, so it must pass through.)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(en|sl)(\/|$)/.test(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/sl${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip the CMS (admin, REST API, preview routes), Next internals and files in public/.
  matcher: [
    '/((?!(?:admin|api|next|_next|logos|assets)(?:/|$)|favicon\\.|robots\\.txt|healthz).*)',
  ],
};

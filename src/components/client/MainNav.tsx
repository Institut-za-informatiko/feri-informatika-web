'use client';

import { cn } from 'cn';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type Lang, locales } from '@/i18n/translations';
import { getAlternateUrl, localePath } from '@/i18n/utils';

type Item = { href: string; label: string };

/** "SL / EN": the current language as text, the other as a link to the same page. */
function LangSwitch({
  lang,
  pathname,
  label,
  onNavigate,
  className,
}: {
  lang: Lang;
  pathname: string;
  label: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  return (
    <nav
      aria-label={label}
      className={cn(
        'flex items-center gap-1 font-mono text-sm text-muted-foreground',
        className
      )}
    >
      {locales.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className="select-none">/</span>}
          {code === lang ? (
            <span className="font-semibold text-foreground uppercase">
              {code}
            </span>
          ) : (
            <Link
              href={getAlternateUrl(pathname, lang)}
              hrefLang={code}
              // Keep the query (e.g. an active ?tag= filter) when switching language.
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.();
                router.push(
                  `${getAlternateUrl(pathname, lang)}${window.location.search}`
                );
              }}
              className="uppercase transition-colors hover:text-primary"
            >
              {code}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Site navigation: flush with the page at the very top, detaching into a floating pill once
 * the page scrolls. On phones the menu unfolds inside the same pill.
 */
export function MainNav({
  lang,
  items,
  siteName,
  labels,
}: {
  lang: Lang;
  items: Item[];
  siteName: string;
  labels: { menu: string; close: string; language: string; home: string };
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // A nav item is active for its own page and everything below it (/news → /news/x).
  const section = (href: string) =>
    href
      .replace(/^\/en(?=\/|$)/, '')
      .split('/')
      .filter(Boolean)[0];
  const isActive = (href: string) =>
    Boolean(section(href)) && section(href) === section(pathname);

  const floating = scrolled || open;
  const close = () => setOpen(false);

  return (
    <>
      <nav
        aria-label={labels.menu}
        className={cn(
          'fixed inset-x-0 z-50 mx-auto w-[calc(100%-1.5rem)] max-w-6xl border motion-safe:animate-[nav-enter_0.45s_ease-out_both] sm:w-[calc(100%-3rem)]',
          'transition-[top,background-color,box-shadow,border-radius,border-color,backdrop-filter] duration-300 ease-out',
          floating
            ? 'top-3 border-border/70 bg-card/85 shadow-lg shadow-primary/10 backdrop-blur-xl sm:top-4'
            : 'top-0 border-transparent bg-transparent',
          open ? 'rounded-3xl' : scrolled ? 'rounded-full' : 'rounded-none'
        )}
      >
        <div className="flex h-16 items-center justify-between gap-4 px-3 sm:px-5">
          <Link
            href={localePath(lang, '/')}
            aria-label={labels.home}
            className="group flex min-w-0 items-center gap-2.5"
          >
            {/* biome-ignore lint/performance/noImgElement: static logo */}
            <img
              src="/logos/ii-logo.png"
              alt=""
              className="h-9 w-auto shrink-0"
            />
            <span className="truncate font-heading text-base font-semibold text-foreground sm:text-lg">
              {siteName}
            </span>
            <span className="hidden h-5 w-1 shrink-0 rounded-full bg-highlight transition-transform group-hover:scale-y-125 sm:block" />
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  'aria-[current=page]:text-primary aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-0.5 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-highlight'
                )}
              >
                {item.label}
              </Link>
            ))}
            <LangSwitch
              lang={lang}
              pathname={pathname}
              label={labels.language}
              className="ml-3 border-l pl-4"
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none xl:hidden"
          >
            <span className="sr-only">{open ? labels.close : labels.menu}</span>
            {open ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out xl:hidden',
            open ? 'max-h-[80svh] opacity-100' : 'invisible max-h-0 opacity-0'
          )}
        >
          <div className="flex max-h-[calc(80svh-1rem)] flex-col gap-1 overflow-y-auto border-t px-3 pt-3 pb-4 sm:px-5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted aria-[current=page]:bg-muted aria-[current=page]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <LangSwitch
              lang={lang}
              pathname={pathname}
              label={labels.language}
              onNavigate={close}
              className="mt-2 justify-center border-t pt-4"
            />
          </div>
        </div>
      </nav>

      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-40 cursor-default bg-background/50 backdrop-blur-xs xl:hidden"
        />
      )}
    </>
  );
}

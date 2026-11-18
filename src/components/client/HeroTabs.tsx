'use client';

import { cn } from 'cn';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { type KeyboardEvent, useRef, useState } from 'react';

type Slide = { id: number; title: string; subtitle: string; image?: string };

/**
 * Home hero: a full-width photo with the active slide's text and a row of numbered tabs.
 * The yellow bar on the active tab fills over 7 s and its animationend advances the slide,
 * so hovering or focusing the hero pauses it and reduced motion turns autoplay off.
 */
export function HeroTabs({
  slides,
  label,
  actions,
}: {
  slides: Slide[];
  label: string;
  actions: { href: string; label: string }[];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  if (slides.length === 0) return null;

  const go = (i: number, focus = false) => {
    const next = (i + slides.length) % slides.length;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: slides.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    go(moves[e.key], true);
  };

  return (
    <section
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative isolate flex min-h-[36rem] flex-col justify-end overflow-hidden bg-brand-dark text-primary-foreground sm:min-h-[42rem]"
    >
      {slides.map(
        (s, i) =>
          s.image && (
            // biome-ignore lint/performance/noImgElement: CMS image, already resized
            <img
              key={s.id}
              src={s.image}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              className={cn(
                'absolute inset-0 -z-20 size-full object-cover transition-opacity duration-700',
                i === active ? 'opacity-100' : 'opacity-0'
              )}
            />
          )
      )}
      <div className="absolute inset-0 -z-10 bg-brand-dark/60" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-24 pb-10 sm:px-6 lg:px-11">
        <div className="flex max-w-3xl flex-col gap-6">
          <div className="h-1 w-14 rounded-full bg-highlight" />
          {slides.map((s, i) => (
            <div
              key={s.id}
              id={`hero-panel-${s.id}`}
              {...(slides.length > 1 && {
                role: 'tabpanel',
                'aria-labelledby': `hero-tab-${s.id}`,
              })}
              hidden={i !== active}
              className="flex flex-col gap-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
            >
              <h2 className="text-4xl leading-none font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                {s.title}
              </h2>
              <p className="max-w-xl text-lg text-pretty opacity-90">
                {s.subtitle}
              </p>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            {actions.map((a, i) => (
              <Link
                key={a.href}
                href={a.href}
                className={cn(
                  'inline-flex h-12 items-center gap-2 rounded-full px-6 font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-highlight/60 focus-visible:outline-none',
                  i === 0
                    ? 'bg-highlight text-highlight-foreground hover:bg-highlight/90'
                    : 'bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25'
                )}
              >
                {a.label}
                {i === 0 && <ArrowRightIcon className="size-4" />}
              </Link>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div
            role="tablist"
            aria-label={label}
            onKeyDown={onKeyDown}
            className="grid gap-5 sm:grid-cols-3"
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`hero-tab-${s.id}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`hero-panel-${s.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => go(i)}
                className="group relative flex flex-col gap-2.5 pt-3.5 text-left focus-visible:outline-none"
              >
                <span className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-primary-foreground/30" />
                {i === active && (
                  <span
                    onAnimationEnd={() => go(active + 1)}
                    className={cn(
                      'absolute inset-x-0 top-0 h-[3px] origin-left rounded-full bg-highlight motion-safe:animate-[hero-progress_7s_linear]',
                      paused && '[animation-play-state:paused]'
                    )}
                  />
                )}
                <span
                  className={cn(
                    'font-mono text-sm',
                    i === active
                      ? 'text-highlight'
                      : 'text-primary-foreground/75'
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-[0.95rem] font-semibold underline-offset-4 group-hover:underline group-focus-visible:underline',
                    i !== active && 'text-primary-foreground/75'
                  )}
                >
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { cn } from 'cn';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CmsImage } from '@/components/CmsImage';
import type { CmsImage as Img } from '@/lib/media';

export type KioskItem = {
  id: number;
  title: string;
  summary: string;
  date: string;
  tag: string;
  cover?: Img;
  qr: string;
};

/** Seconds each story stays on screen; matches the bar's animate-[…_10s_…] below. */
const SLIDE_MS = 10_000;
/** How often the screen asks the server for new stories. */
const REFRESH_MS = 5 * 60_000;

function useClock() {
  // Starts empty so the server render and the first client render match.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * Full-screen news loop for the faculty info screen, sized in vw so it fills the display.
 * Landscape puts the sidebar to the right of the story, portrait (a vertical screen) below it.
 * No interaction: it advances on a timer and refreshes itself.
 */
export function KioskBoard({
  items,
  labels,
}: {
  items: KioskItem[];
  labels: {
    site: string;
    next: string;
    qrTitle: string;
    qrLead: string;
    qrAlt: string;
  };
}) {
  const router = useRouter();
  const now = useClock();
  const [index, setIndex] = useState(0);
  const active = items.length ? index % items.length : 0;

  useEffect(() => {
    if (items.length < 2) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % items.length),
      SLIDE_MS
    );
    return () => clearTimeout(id);
  }, [index, items.length]);

  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  const current = items[active];
  const upcoming = [1, 2, 3]
    .filter((k) => k < items.length)
    .map((k) => items[(active + k) % items.length]);

  return (
    <div className="grid h-svh cursor-none overflow-hidden bg-brand-dark text-primary-foreground landscape:grid-cols-[1fr_35.4vw] portrait:grid-rows-[1fr_auto]">
      <section aria-live="polite" className="relative overflow-hidden">
        {items.map(
          (item, i) =>
            item.cover && (
              <CmsImage
                key={item.id}
                src={item.cover}
                alt=""
                sizes="(orientation: portrait) 100vw, 65vw"
                loading="eager"
                className={cn(
                  'absolute inset-0 size-full object-cover transition-opacity duration-1000',
                  i === active ? 'opacity-100' : 'opacity-0'
                )}
              />
            )
        )}
        {current && (
          <article
            key={current.id}
            className="absolute inset-x-[2.5vw] bottom-[2.9vw] flex animate-in flex-col gap-[0.95vw] rounded-[1.45vw] bg-brand-dark p-[2.4vw] shadow-2xl duration-700 fade-in slide-in-from-bottom-4 portrait:inset-x-[4vw] portrait:bottom-[4vw] portrait:gap-[1.8vw] portrait:rounded-[2.6vw] portrait:p-[4.5vw]"
          >
            <p className="flex items-center gap-[0.85vw] portrait:gap-[1.6vw]">
              <span className="rounded-full bg-highlight px-[0.85vw] py-[0.3vw] text-[1.05vw] font-bold text-highlight-foreground portrait:px-[1.6vw] portrait:py-[0.55vw] portrait:text-[2vw]">
                {current.tag}
              </span>
              <span className="font-mono text-[1.15vw] text-highlight portrait:text-[2.2vw]">
                {current.date}
              </span>
            </p>
            <h1 className="text-[3.35vw] leading-[1.04] font-bold tracking-tight text-balance portrait:text-[6.4vw]">
              {current.title}
            </h1>
            {current.summary && (
              <p className="line-clamp-3 text-[1.35vw] leading-normal text-primary-foreground/85 portrait:text-[2.6vw]">
                {current.summary}
              </p>
            )}
          </article>
        )}
      </section>

      <aside className="flex min-h-0 flex-col gap-[2.1vw] px-[2.5vw] pt-[2.5vw] pb-[2.1vw] portrait:gap-[3.2vw] portrait:p-[4vw]">
        <div className="flex items-center gap-[0.75vw] portrait:gap-[1.4vw]">
          <span className="rounded-[0.75vw] bg-card px-[0.5vw] py-[0.4vw] portrait:rounded-[1.4vw] portrait:px-[0.9vw] portrait:py-[0.7vw]">
            {/* biome-ignore lint/performance/noImgElement: static logo */}
            <img
              src="/logos/ii-logo.png"
              alt=""
              className="h-[2.3vw] w-auto portrait:h-[4.4vw]"
            />
          </span>
          <span className="font-heading text-[1.55vw] leading-tight font-bold portrait:text-[3vw]">
            {labels.site}
          </span>
          <span className="h-[1.55vw] w-[0.26vw] rounded-full bg-highlight portrait:h-[3vw] portrait:w-[0.5vw]" />
        </div>

        <div className="flex min-h-[10.5vw] flex-col gap-[0.2vw] border-b border-primary-foreground/20 pb-[1.7vw] portrait:min-h-[17vw] portrait:pb-[3vw]">
          {now && (
            <>
              <time
                dateTime={now.toISOString()}
                className="font-heading text-[6.9vw] leading-[0.95] font-bold tracking-tight tabular-nums portrait:text-[11vw]"
              >
                {now.toLocaleTimeString('sl-SI', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
              <span className="text-[1.35vw] text-primary-foreground/80 portrait:text-[2.6vw]">
                {now.toLocaleDateString('sl-SI', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </>
          )}
        </div>

        {upcoming.length > 0 && (
          <div className="flex min-h-0 flex-1 flex-col gap-[0.95vw] portrait:gap-[1.8vw]">
            <h2 className="font-mono text-[0.95vw] tracking-widest text-primary-foreground/70 uppercase portrait:text-[1.8vw]">
              {labels.next}
            </h2>
            <ul className="flex flex-col gap-[0.95vw] portrait:gap-[1.8vw]">
              {upcoming.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[6.9vw_1fr] items-center gap-[1.05vw] portrait:grid-cols-[13vw_1fr] portrait:gap-[2vw]"
                >
                  <div className="h-[4.6vw] overflow-hidden rounded-[0.65vw] bg-primary portrait:h-[8.6vw] portrait:rounded-[1.2vw]">
                    {item.cover && (
                      <CmsImage
                        src={item.cover}
                        alt=""
                        sizes="(orientation: portrait) 13vw, 7vw"
                        className="size-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-[0.2vw] portrait:gap-[0.4vw]">
                    <span className="font-mono text-[0.85vw] text-highlight portrait:text-[1.7vw]">
                      {item.date}
                    </span>
                    <span className="line-clamp-2 font-heading text-[1.2vw] leading-tight font-semibold portrait:text-[2.5vw]">
                      {item.title}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {current && (
          <div className="flex items-center gap-[1.25vw] rounded-[1.15vw] bg-highlight p-[1.05vw] text-highlight-foreground portrait:gap-[2.4vw] portrait:rounded-[2.2vw] portrait:p-[2vw]">
            {/* biome-ignore lint/performance/noImgElement: generated QR code (data URI) */}
            <img
              src={current.qr}
              alt={labels.qrAlt}
              className="size-[6.9vw] shrink-0 rounded-[0.6vw] bg-card portrait:size-[13vw] portrait:rounded-[1.1vw]"
            />
            <div className="flex flex-col gap-[0.3vw] portrait:gap-[0.6vw]">
              <span className="font-heading text-[1.55vw] leading-tight font-bold portrait:text-[3vw]">
                {labels.qrTitle}
              </span>
              <span className="text-[1.05vw] portrait:text-[2vw]">
                {labels.qrLead}
              </span>
            </div>
          </div>
        )}

        {items.length > 1 && (
          <div
            aria-hidden="true"
            className="flex gap-[0.5vw] portrait:gap-[1vw]"
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                className="h-[0.3vw] flex-1 overflow-hidden rounded-full bg-primary-foreground/20 portrait:h-[0.6vw]"
              >
                {i === active && (
                  <div
                    key={index}
                    className="h-full origin-left animate-[hero-progress_10s_linear_both] bg-highlight"
                  />
                )}
                {i < active && (
                  <div className="h-full bg-primary-foreground/60" />
                )}
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

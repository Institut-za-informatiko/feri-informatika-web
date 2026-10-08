'use client';

import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type Slide = { id: number; title: string; subtitle: string; image?: string };

/** Home hero: swipeable on phones, arrows on larger screens, advances every 6 s. */
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }));
  if (slides.length === 0) return null;

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[autoplay.current]}
      className="relative"
    >
      <CarouselContent className="ml-0">
        {slides.map((s, i) => (
          <CarouselItem key={s.id} className="pl-0">
            <div className="relative isolate flex min-h-[22rem] items-end overflow-hidden bg-brand-dark sm:min-h-[28rem]">
              {s.image && (
                // biome-ignore lint/performance/noImgElement: CMS image, already resized
                <img
                  src={s.image}
                  alt=""
                  className="absolute inset-0 -z-10 size-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : undefined}
                />
              )}
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-brand-dark via-brand-dark/70 to-brand-dark/10 sm:bg-linear-to-r sm:from-brand-dark sm:via-brand-dark/80 sm:to-transparent" />
              <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-14 sm:px-6 sm:pb-20">
                <div className="flex max-w-xl flex-col gap-4 text-primary-foreground">
                  <div className="h-1 w-14 rounded-full bg-highlight" />
                  {i === 0 ? (
                    <h1 className="text-3xl font-bold text-balance sm:text-5xl">
                      {s.title}
                    </h1>
                  ) : (
                    <h2 className="text-3xl font-bold text-balance sm:text-5xl">
                      {s.title}
                    </h2>
                  )}
                  <p className="text-base text-pretty opacity-90 sm:text-lg">
                    {s.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {slides.length > 1 && (
        <>
          <CarouselPrevious className="left-4 hidden sm:inline-flex" />
          <CarouselNext className="right-4 hidden sm:inline-flex" />
        </>
      )}
    </Carousel>
  );
}

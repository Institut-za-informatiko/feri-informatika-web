'use client';

import { useState } from 'react';
import { CmsImage } from '@/components/CmsImage';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { CmsImage as Img } from '@/lib/media';

/** Thumbnail grid; a click opens a full-screen, swipeable carousel at that image. */
export function GalleryDialog({
  images,
  title,
  openLabel,
  ofLabel,
}: {
  images: Img[];
  title: string;
  openLabel: string;
  ofLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onApi = (a: CarouselApi) => {
    setApi(a);
    if (!a) return;
    a.scrollTo(start, true);
    setCurrent(a.selectedScrollSnap());
    a.on('select', () => setCurrent(a.selectedScrollSnap()));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            aria-label={`${openLabel} ${i + 1}`}
            onClick={() => {
              setStart(i);
              setOpen(true);
              api?.scrollTo(i, true);
            }}
            className="group overflow-hidden rounded-lg bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <CmsImage
              src={img}
              alt=""
              sizes="(max-width: 640px) 50vw, 25vw"
              className="aspect-square size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-1rem)] gap-3 bg-black/95 p-3 text-white ring-0 sm:max-w-5xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <Carousel setApi={onApi} opts={{ loop: true, startIndex: start }}>
            <CarouselContent>
              {images.map((img) => (
                <CarouselItem
                  key={img.src}
                  className="flex items-center justify-center"
                >
                  <CmsImage
                    src={img}
                    alt=""
                    sizes="100vw"
                    loading="eager"
                    className="max-h-[80svh] w-auto object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hidden sm:inline-flex" />
            <CarouselNext className="right-2 hidden sm:inline-flex" />
          </Carousel>
          <p className="text-center text-sm tabular-nums opacity-80">
            {current + 1} {ofLabel} {images.length}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

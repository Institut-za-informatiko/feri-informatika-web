import { cn } from 'cn';
import { CalendarIcon, ExternalLinkIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getTranslations, type Lang } from '@/i18n/translations';
import { formatDate, localePath } from '@/i18n/utils';
import { byDateDesc, findAll } from '@/lib/payload';
import type { Conference } from '@/payload-types';
import type { SidebarLink } from './PageShell';

export const findConferences = async (lang: Lang) =>
  (await findAll('conferences', lang)).sort(byDateDesc);

export const conferencesSidebar = (
  lang: Lang,
  conferences: Conference[]
): SidebarLink[] =>
  conferences.map((c) => ({
    label: c.acronym ?? c.name,
    href: localePath(lang, `/conferences/${c.slug}`),
  }));

/** Date and place line shared by the card and the detail page. */
export function ConferenceMeta({
  conference: c,
  lang,
}: {
  conference: Conference;
  lang: Lang;
}) {
  if (!c.date && !c.location) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
      {c.date && (
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="size-3.5" />
          <time dateTime={c.date}>{formatDate(c.date, lang)}</time>
        </span>
      )}
      {c.location && (
        <span className="flex items-center gap-1.5">
          <MapPinIcon className="size-3.5" />
          {c.location}
        </span>
      )}
    </div>
  );
}

/**
 * The title link stretches over the whole card, so the card opens the detail page
 * while the website link in the footer stays a separate (non-nested) link.
 */
export function ConferenceCard({
  conference: c,
  lang,
}: {
  conference: Conference;
  lang: Lang;
}) {
  const t = getTranslations(lang);
  return (
    <Card className="group relative w-full border-t-4 border-t-primary transition-shadow has-[a:hover]:shadow-lg">
      <CardHeader className="gap-3">
        <CardTitle className="text-lg leading-snug">
          <Link
            href={localePath(lang, `/conferences/${c.slug}`)}
            className="outline-none group-has-[a:hover]:text-primary after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {c.name}
            {c.acronym && (
              <span className="font-normal text-muted-foreground">
                {' '}
                ({c.acronym})
              </span>
            )}
          </Link>
        </CardTitle>
        <ConferenceMeta conference={c} lang={lang} />
        <CardDescription className="line-clamp-3">
          {c.description}
        </CardDescription>
      </CardHeader>
      {c.url && (
        <CardFooter className="mt-auto">
          <Link
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: 'link', size: 'sm' }),
              'relative z-10 px-0'
            )}
          >
            {t('conferences.website')}
            <ExternalLinkIcon data-icon="inline-end" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

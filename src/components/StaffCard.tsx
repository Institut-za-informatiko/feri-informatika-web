import { cn } from 'cn';
import { MailIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { toImage } from '@/lib/media';
import type { Staff } from '@/payload-types';
import { CmsImage } from './CmsImage';

export const staffHref = (lang: Lang, person: Staff) =>
  localePath(lang, `/staff/${person.slug}`);

/** Square photo, or the initial when there is none. */
export function StaffAvatar({
  person,
  className,
  sizes,
}: {
  person: Staff;
  className?: string;
  sizes: string;
}) {
  const photo = toImage(person.photo);
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden bg-muted font-heading font-bold text-primary',
        className
      )}
    >
      {photo ? (
        <CmsImage
          src={photo}
          alt={person.name}
          sizes={sizes}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden>{person.name.charAt(0)}</span>
      )}
    </div>
  );
}

export function StaffCard({ person, lang }: { person: Staff; lang: Lang }) {
  return (
    <a
      href={staffHref(lang, person)}
      className="group flex w-full rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <Card className="w-full transition-shadow group-hover:shadow-lg">
        <CardContent className="flex items-start gap-4">
          <StaffAvatar
            person={person}
            sizes="64px"
            className="size-16 rounded-lg text-xl"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-heading font-semibold leading-snug text-foreground break-words group-hover:text-primary">
              {person.name}
            </p>
            {person.title && (
              <p className="text-sm text-muted-foreground italic">
                {person.title}
              </p>
            )}
            {person.role && (
              <p className="text-sm text-foreground">{person.role}</p>
            )}
            {person.email && (
              <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                <MailIcon className="size-3.5 shrink-0" />
                <span className="truncate">{person.email}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

/** Compact member row (laboratory pages). */
export function StaffChip({ person, lang }: { person: Staff; lang: Lang }) {
  return (
    <a
      href={staffHref(lang, person)}
      className="group flex min-w-0 items-center gap-3 rounded-lg border bg-card p-2.5 transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <StaffAvatar
        person={person}
        sizes="44px"
        className="size-11 rounded-full"
      />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold leading-snug break-words text-primary">
          {person.name}
        </span>
        {person.role && (
          <span className="text-xs text-muted-foreground">{person.role}</span>
        )}
      </div>
    </a>
  );
}

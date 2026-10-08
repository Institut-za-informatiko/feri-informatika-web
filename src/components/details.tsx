import { cn } from 'cn';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';

/** Label/value pairs on detail pages (type, duration, date, …). Empty values are skipped. */
export function FactList({
  items,
}: {
  items: { label: string; value?: ReactNode }[];
}) {
  const shown = items.filter(
    (i) => i.value !== undefined && i.value !== null && i.value !== ''
  );
  if (shown.length === 0) return null;
  return (
    <dl className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {shown.map((i) => (
        <div key={i.label} className="flex flex-col gap-1">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {i.label}
          </dt>
          <dd className="font-medium text-foreground">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'h-auto min-h-8 self-start py-1.5 whitespace-normal'
      )}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      {children}
    </a>
  );
}

/** Plain list of links to sub-pages (laboratories, interest groups). */
export function ArrowLinkList({
  items,
  emptyLabel,
}: {
  items: { href: string; label: ReactNode; key: string | number }[];
  emptyLabel: string;
}) {
  if (items.length === 0)
    return <p className="text-muted-foreground">{emptyLabel}</p>;
  return (
    <ul className="flex flex-col divide-y rounded-xl border bg-card">
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={item.href}
            className="group flex items-center gap-3 px-4 py-3.5 font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ArrowRightIcon className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
            <span className="min-w-0 break-words">{item.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Link to a website outside the site, opened in a new tab. */
export function ExternalLinkButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({
        variant: 'outline',
        className: 'self-start',
      })}
    >
      {children}
      <ArrowUpRightIcon data-icon="inline-end" />
    </a>
  );
}

/** Label/value rows (contact details). Rows without a value are skipped. */
export function DetailList({
  items,
}: {
  items: { label: string; value?: ReactNode; icon?: ReactNode }[];
}) {
  const rows = items.filter((i) => i.value);
  if (rows.length === 0) return null;
  return (
    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_minmax(0,1fr)]">
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="flex items-center gap-2 font-semibold text-foreground">
            {row.icon}
            {row.label}
          </dt>
          <dd className="min-w-0 break-words text-muted-foreground max-sm:mb-2 max-sm:pl-6">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

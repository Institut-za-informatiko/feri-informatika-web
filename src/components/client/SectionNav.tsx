'use client';

import { cn } from 'cn';
import { ChevronDownIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export type SidebarLink = {
  label: string;
  href: string;
  children?: { label: string; href: string; sidebarLevel?: 'tertiary' }[];
};

/**
 * Section navigation. Desktop: sticky column. Phones: collapsed under the header.
 * A link shows its children when it or one of them is the current page.
 */
export function SectionNav({
  title,
  links,
  menuLabel,
}: {
  title: string;
  links: SidebarLink[];
  menuLabel: string;
}) {
  const current = decodeURIComponent(usePathname());
  const isCurrent = (href: string) => current === decodeURIComponent(href);

  const list = (
    <nav aria-label={title} className="flex flex-col gap-0.5">
      {links.map((link) => {
        const open =
          isCurrent(link.href) ||
          (link.children ?? []).some((c) => isCurrent(c.href));
        return (
          <div key={link.href} className="flex flex-col gap-0.5">
            <a
              href={link.href}
              aria-current={isCurrent(link.href) ? 'page' : undefined}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'h-auto min-h-8 justify-start py-1.5 text-left whitespace-normal',
                open && 'bg-muted font-semibold text-primary'
              )}
            >
              {link.label}
            </a>
            {open && link.children && (
              <div className="ml-3 flex flex-col gap-0.5 border-l pl-2">
                {link.children.map((child) => (
                  <a
                    key={child.href}
                    href={child.href}
                    aria-current={isCurrent(child.href) ? 'page' : undefined}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'xs' }),
                      'h-auto min-h-7 justify-start py-1 text-left font-normal whitespace-normal text-muted-foreground',
                      'aria-[current=page]:font-semibold aria-[current=page]:text-primary'
                    )}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex max-h-[calc(100svh-7rem)] flex-col gap-3 overflow-y-auto">
          <p className="px-2.5 font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {title}
          </p>
          {list}
        </div>
      </aside>
      <Collapsible className="rounded-lg border bg-card lg:hidden">
        <CollapsibleTrigger
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'group h-11 w-full justify-between px-4'
          )}
        >
          <span>
            {menuLabel}: <span className="font-semibold">{title}</span>
          </span>
          <ChevronDownIcon className="transition-transform group-data-panel-open:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2 pb-2">{list}</CollapsibleContent>
      </Collapsible>
    </>
  );
}

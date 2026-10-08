import { cn } from 'cn';
import { ChevronDownIcon } from 'lucide-react';
import { aboutSidebar } from '@/components/aboutNav';
import { Section, SectionNews } from '@/components/cards';
import { PageShell } from '@/components/PageShell';
import { StaffCard } from '@/components/StaffCard';
import { buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { getTranslations, type Lang } from '@/i18n/translations';
import { findAll } from '@/lib/payload';
import type { Staff } from '@/payload-types';

type Props = { params: Promise<{ locale: Lang }> };

const CURRENT = ['predstojnik', 'profesorji', 'asistenti', 'tehnicno'] as const;

/** People without a section were listed with the professors on the old site. */
const sectionOf = (p: Staff) => p.section ?? 'profesorji';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: getTranslations(locale)('staff.title') };
}

function StaffGrid({ people, lang }: { people: Staff[]; lang: Lang }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {people.map((p) => (
        <StaffCard key={p.id} person={p} lang={lang} />
      ))}
    </div>
  );
}

export default async function StaffPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const staff = await findAll('staff', lang, { sort: 'name' });
  const former = staff.filter((p) => sectionOf(p) === 'prejsnji');

  return (
    <PageShell
      lang={lang}
      title={t('staff.title')}
      lead={t('staff.lead')}
      sidebarTitle={t('about.title')}
      sidebarLinks={aboutSidebar(lang, { staff })}
    >
      {CURRENT.map((key) => {
        const people = staff.filter((p) => sectionOf(p) === key);
        if (people.length === 0) return null;
        return (
          <Section key={key} title={t(`staff.section.${key}`)}>
            <StaffGrid people={people} lang={lang} />
          </Section>
        );
      })}
      {former.length > 0 && (
        <Collapsible className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-3">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              {t('staff.section.prejsnji')}
            </h2>
            <CollapsibleTrigger
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'group shrink-0'
              )}
            >
              <span className="group-data-panel-open:hidden">
                {t('staff.former.show')}
              </span>
              <span className="hidden group-data-panel-open:inline">
                {t('staff.former.hide')}
              </span>
              <ChevronDownIcon
                data-icon="inline-end"
                className="transition-transform group-data-panel-open:rotate-180"
              />
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <StaffGrid people={former} lang={lang} />
          </CollapsibleContent>
        </Collapsible>
      )}
      <SectionNews tag="student" lang={lang} />
    </PageShell>
  );
}

import {
  ArrowUpRightIcon,
  BookOpenIcon,
  ClockIcon,
  DoorOpenIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
} from 'lucide-react';
import Link from 'next/link';
import { aboutSidebar } from '@/components/aboutNav';
import { Section, SectionNews } from '@/components/cards';
import { BackLink, DetailList, ExternalLinkButton } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { formalName, StaffAvatar } from '@/components/StaffCard';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { toImage } from '@/lib/media';
import { findAll, findBySlug } from '@/lib/payload';

/** Former staff live under `former/…`, hence the catch-all segment. */
type Props = { params: Promise<{ locale: Lang; slug: string[] }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const person = await findBySlug('staff', slug.join('/'), locale);
  const photo = toImage(person.photo);
  return {
    title: person.name,
    description: [formalName(person), person.role].filter(Boolean).join(' · '),
    openGraph: photo ? { images: [photo.src] } : undefined,
  };
}

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {children}
      <ArrowUpRightIcon className="size-3.5" />
    </Link>
  );
}

export default async function StaffProfilePage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const [person, staff] = await Promise.all([
    findBySlug('staff', slug.join('/'), lang),
    findAll('staff', lang, { sort: 'name' }),
  ]);
  const icon = 'size-4 text-primary';

  return (
    <PageShell
      lang={lang}
      title={formalName(person)}
      sidebarTitle={t('about.title')}
      sidebarLinks={aboutSidebar(lang, { staff })}
    >
      <Card>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <StaffAvatar
            person={person}
            sizes="160px"
            className="size-24 rounded-xl text-4xl sm:size-40 sm:text-5xl"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {person.role && (
              <p className="text-base font-medium text-foreground">
                {person.role}
              </p>
            )}
            <DetailList
              items={[
                {
                  label: t('staff.email'),
                  icon: <MailIcon className={icon} />,
                  value: person.email && (
                    <Link
                      href={`mailto:${person.email}`}
                      className="text-primary hover:underline"
                    >
                      {person.email}
                    </Link>
                  ),
                },
                {
                  label: t('staff.phone'),
                  icon: <PhoneIcon className={icon} />,
                  value: person.phone,
                },
                {
                  label: t('staff.office'),
                  icon: <DoorOpenIcon className={icon} />,
                  value: person.office,
                },
                {
                  label: t('staff.contactHours'),
                  icon: <ClockIcon className={icon} />,
                  value: person.contactHours && (
                    <ExternalLink href={person.contactHours}>
                      {t('staff.link')}
                    </ExternalLink>
                  ),
                },
                {
                  label: t('staff.linkedin'),
                  icon: <LinkIcon className={icon} />,
                  value: person.linkedin && (
                    <ExternalLink href={person.linkedin}>
                      {t('staff.link')}
                    </ExternalLink>
                  ),
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {person.sections?.map((section) => (
        <Section key={section.id ?? section.heading} title={section.heading}>
          <Prose>
            <RichText data={section.content} />
          </Prose>
        </Section>
      ))}

      {person.cobiss && (
        <Section title={t('staff.cobiss')}>
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-muted-foreground">
              <BookOpenIcon className="size-4 shrink-0 text-primary" />
              {t('staff.cobissText')}
            </p>
            <ExternalLinkButton href={person.cobiss}>
              {t('staff.cobissLink')}
            </ExternalLinkButton>
          </div>
        </Section>
      )}

      <BackLink href={localePath(lang, '/staff')}>
        {t('staff.backLink')}
      </BackLink>
      <SectionNews tag="student" lang={lang} />
    </PageShell>
  );
}

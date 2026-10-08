import { aboutSidebar } from '@/components/aboutNav';
import { Section, SectionNews } from '@/components/cards';
import { ExternalLinkButton } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { StaffChip } from '@/components/StaffCard';
import { getTranslations, type Lang } from '@/i18n/translations';
import { findAll, findBySlug } from '@/lib/payload';
import type { Staff } from '@/payload-types';

type Props = { params: Promise<{ locale: Lang; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const lab = await findBySlug('laboratories', slug, locale, 0);
  return { title: lab.name, description: lab.description };
}

export default async function LaboratoryPage({ params }: Props) {
  const { locale: lang, slug } = await params;
  const t = getTranslations(lang);
  const [lab, labs] = await Promise.all([
    // depth 2: members and their photos
    findBySlug('laboratories', slug, lang, 2),
    findAll('laboratories', lang, { sort: 'name', depth: 0 }),
  ]);
  // Unpublished staff come back as bare ids.
  const members = (lab.members ?? []).filter(
    (m): m is Staff => typeof m === 'object'
  );
  const areas = lab.researchAreas ?? [];

  return (
    <PageShell
      lang={lang}
      title={lab.name}
      eyebrow={lab.acronym}
      sidebarTitle={t('about.title')}
      sidebarLinks={aboutSidebar(lang, { labs })}
    >
      {lab.description && <p className="text-pretty">{lab.description}</p>}
      {areas.length > 0 && (
        <Section title={t('labs.researchAreas')}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {areas.map((a) => (
              <li key={a.id ?? a.area} className="flex items-start gap-2.5">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-highlight" />
                <span>{a.area}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      {members.length > 0 && (
        <Section title={t('labs.members')}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((m) => (
              <StaffChip key={m.id} person={m} lang={lang} />
            ))}
          </div>
        </Section>
      )}
      {lab.body && (
        <Section title={t('labs.description')}>
          <Prose>
            <RichText data={lab.body} />
          </Prose>
        </Section>
      )}
      {lab.externalUrl && (
        <ExternalLinkButton href={lab.externalUrl}>
          {t('labs.website')}
        </ExternalLinkButton>
      )}
      <SectionNews tag="scientific" lang={lang} />
    </PageShell>
  );
}

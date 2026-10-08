import { CmsPage, cmsPageMetadata } from '@/components/CmsPage';
import { EmptyState, Section } from '@/components/cards';
import { researchSidebar } from '@/components/researchNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations, type Lang } from '@/i18n/translations';
import { formatDate } from '@/i18n/utils';
import { byDateDesc, findAll } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang }> };

const SLUG = 'research/ethics';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return cmsPageMetadata(SLUG, locale);
}

export default async function EthicsPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const opinions = (await findAll('ethics-opinions', lang)).sort(byDateDesc);

  return (
    <CmsPage
      slug={SLUG}
      lang={lang}
      sidebarLinks={researchSidebar(lang)}
      newsTag="scientific"
    >
      <Section title={t('research.ethics.opinions')}>
        {opinions.length === 0 ? (
          <EmptyState>{t('research.ethics.noOpinions')}</EmptyState>
        ) : (
          <ul className="flex flex-col gap-4">
            {opinions.map((o) => (
              <li key={o.id}>
                <Card className="border-l-4 border-l-primary">
                  <CardHeader className="gap-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="sr-only">
                        {t('research.ethics.date')}:{' '}
                      </span>
                      <time dateTime={o.date}>{formatDate(o.date, lang)}</time>
                    </p>
                    <CardTitle className="text-lg leading-snug">
                      <span className="sr-only">
                        {t('research.ethics.research')}:{' '}
                      </span>
                      {o.research}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid gap-4 text-sm sm:grid-cols-2">
                      {[
                        [t('research.ethics.researchers'), o.researchers],
                        [t('research.ethics.decision'), o.decision],
                      ].map(([label, value]) => (
                        <div key={label} className="flex flex-col gap-1">
                          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {label}
                          </dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </CmsPage>
  );
}

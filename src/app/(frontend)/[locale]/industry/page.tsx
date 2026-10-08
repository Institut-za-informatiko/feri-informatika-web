import { CmsImage } from '@/components/CmsImage';
import { SectionNews } from '@/components/cards';
import { ExternalLinkButton } from '@/components/details';
import { PageShell } from '@/components/PageShell';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations, type Lang } from '@/i18n/translations';
import { localePath } from '@/i18n/utils';
import { toImage } from '@/lib/media';
import { findAll } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: getTranslations(locale)('industry.title') };
}

export default async function IndustryPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const partners = await findAll('industry-partners', lang, { sort: 'name' });

  return (
    <PageShell
      lang={lang}
      title={t('industry.title')}
      lead={t('industry.lead')}
      sidebarTitle={t('industry.title')}
      sidebarLinks={partners.map((p) => ({
        label: p.name,
        href: localePath(lang, `/industry#${p.slug}`),
      }))}
    >
      {partners.length === 0 && (
        <p className="text-muted-foreground">{t('industry.noContent')}</p>
      )}
      <div className="flex flex-col gap-4">
        {partners.map((p) => {
          const logo = toImage(p.logo);
          return (
            <Card key={p.id} id={p.slug} className="scroll-mt-24">
              <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {logo && (
                  <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-lg bg-muted p-3 sm:w-44">
                    <CmsImage
                      src={logo}
                      alt={p.name}
                      sizes="176px"
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                )}
                <div className="flex min-w-0 flex-col gap-2">
                  <h2 className="text-lg font-semibold break-words text-foreground">
                    {p.name}
                  </h2>
                  <p className="text-muted-foreground">{p.description}</p>
                  {p.url && (
                    <ExternalLinkButton href={p.url}>
                      {t('industry.website')}
                    </ExternalLinkButton>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <SectionNews tag="professional" lang={lang} />
    </PageShell>
  );
}

import { GlobeIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import { aboutSidebar } from '@/components/aboutNav';
import { Section, SectionNews } from '@/components/cards';
import { DetailList } from '@/components/details';
import { PageShell, Prose } from '@/components/PageShell';
import { RichText } from '@/components/RichText';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations, type Lang } from '@/i18n/translations';
import { findGlobal } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const about = await findGlobal('about', locale);
  return {
    title: getTranslations(locale)('about.title'),
    description: about.subtitle,
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const about = await findGlobal('about', lang);
  const icon = 'size-4 text-primary';

  return (
    <PageShell
      lang={lang}
      title={about.title}
      lead={about.subtitle}
      sidebarTitle={t('about.title')}
      sidebarLinks={aboutSidebar(lang)}
    >
      <Prose>
        <RichText data={about.body} />
      </Prose>
      {(about.contactEmail ||
        about.contactAddress ||
        about.contactPhone ||
        about.contactWebsite) && (
        <Section title={t('about.contact')}>
          <Card>
            <CardContent>
              <DetailList
                items={[
                  {
                    label: t('about.email'),
                    icon: <MailIcon className={icon} />,
                    value: about.contactEmail && (
                      <Link
                        href={`mailto:${about.contactEmail}`}
                        className="text-primary hover:underline"
                      >
                        {about.contactEmail}
                      </Link>
                    ),
                  },
                  {
                    label: t('about.address'),
                    icon: <MapPinIcon className={icon} />,
                    value: about.contactAddress,
                  },
                  {
                    label: t('about.phone'),
                    icon: <PhoneIcon className={icon} />,
                    value: about.contactPhone,
                  },
                  {
                    label: t('about.web'),
                    icon: <GlobeIcon className={icon} />,
                    value: about.contactWebsite && (
                      <Link
                        href={about.contactWebsite}
                        className="text-primary hover:underline"
                      >
                        {about.contactWebsite.replace(/^https?:\/\//, '')}
                      </Link>
                    ),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Section>
      )}
      <SectionNews tag="interest-groups" lang={lang} />
    </PageShell>
  );
}

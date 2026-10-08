import { AchievementCard, TagFilteredGrid } from '@/components/cards';
import { PageShell } from '@/components/PageShell';
import { getTranslations, type Lang } from '@/i18n/translations';
import { byDateDesc, findAll } from '@/lib/payload';

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return { title: getTranslations(locale)('achievements.title') };
}

export default async function AchievementsPage({ params }: Props) {
  const { locale: lang } = await params;
  const t = getTranslations(lang);
  const achievements = (await findAll('achievements', lang)).sort(byDateDesc);

  return (
    <PageShell lang={lang} title={t('achievements.title')} wide>
      <TagFilteredGrid
        lang={lang}
        emptyLabel={t('achievements.noContent')}
        items={achievements.map((a) => ({
          key: a.id,
          tags: a.tags,
          node: <AchievementCard item={a} lang={lang} />,
        }))}
      />
    </PageShell>
  );
}

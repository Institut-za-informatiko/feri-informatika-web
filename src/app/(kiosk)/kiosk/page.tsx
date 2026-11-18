import QRCode from 'qrcode';
import { tagLabel } from '@/components/cards';
import { KioskBoard, type KioskItem } from '@/components/client/KioskBoard';
import { getTranslations } from '@/i18n/translations';
import { formatDate, localePath } from '@/i18n/utils';
import { coverOf } from '@/lib/media';
import { findAll } from '@/lib/payload';

const lang = 'sl';
const t = getTranslations(lang);
const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

// Rendered per request (a few screens, every 5 min), so the build needs no database.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: `${t('kiosk.title')} — ${t('site.name')}`,
  robots: { index: false, follow: false },
};

/** QR code for a story, as an inline SVG image so the screen needs no extra request. */
async function qr(url: string) {
  const svg = await QRCode.toString(url, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** /kiosk: the newest news on a loop, for the info screen at the faculty. */
export default async function KioskPage() {
  const news = (await findAll('news', lang, { sort: '-date' })).slice(0, 8);

  const items: KioskItem[] = await Promise.all(
    news.map(async (n) => ({
      id: n.id,
      title: n.title,
      summary: n.summary ?? '',
      date: n.date ? formatDate(n.date, lang) : '',
      tag: n.tags?.[0] ? tagLabel(n.tags[0], lang) : t('nav.news'),
      cover: coverOf(n),
      qr: await qr(`${serverURL}${localePath(lang, `/news/${n.slug}`)}`),
    }))
  );

  return (
    <KioskBoard
      items={items}
      labels={{
        site: t('site.name'),
        next: t('kiosk.next'),
        qrTitle: t('kiosk.qrTitle'),
        qrLead: t('kiosk.qrLead'),
        qrAlt: t('kiosk.qrAlt'),
      }}
    />
  );
}

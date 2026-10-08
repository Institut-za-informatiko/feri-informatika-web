/**
 * One-off import of the former Sveltia markdown content into Payload.
 *
 *   CONTENT_DIR=../src/content MEDIA_SRC=../src/assets/media pnpm import:markdown
 *
 * Idempotent: documents are upserted by slug and media by filename, so it can be re-run.
 * Slugs reproduce the ids Astro's glob loader derived from filenames, so URLs stay the same.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical';
import { slug as githubSlug } from 'github-slugger';
import matter from 'gray-matter';
import { type CollectionSlug, getPayload, type Payload } from 'payload';
import config from '../src/payload.config';

const CONTENT_DIR = path.resolve(process.env.CONTENT_DIR ?? '../src/content');
const MEDIA_SRC = path.resolve(process.env.MEDIA_SRC ?? '../src/assets/media');
const ctx = { skipRebuild: true };

type Data = Record<string, unknown>;
type Doc = { file: string; id: string; data: Data; body: string };

const payload: Payload = await getPayload({ config });
const editorConfig = await editorConfigFactory.default({
  config: payload.config,
});

// ── helpers ────────────────────────────────────────────────────────────────

/** Same as Astro's glob generateId: each path segment through github-slugger. */
const astroId = (rel: string) =>
  rel
    .replace(/\.md$/, '')
    .split('/')
    .map((s) => githubSlug(s))
    .join('/');

function readCollection(dir: string): Doc[] {
  const root = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(root)) return [];
  const out: Doc[] = [];
  for (const rel of fs.readdirSync(root, { recursive: true }) as string[]) {
    if (!rel.endsWith('.md')) continue;
    const { data, content } = matter(
      fs.readFileSync(path.join(root, rel), 'utf8')
    );
    out.push({ file: rel, id: astroId(rel), data, body: content.trim() });
  }
  return out;
}

const str = (v: unknown) =>
  typeof v === 'string' && v.trim() ? v.trim() : undefined;
const num = (v: unknown) =>
  v === '' || v == null || Number.isNaN(Number(v)) ? undefined : Number(v);
const date = (v: unknown) =>
  v ? new Date(v as string).toISOString() : undefined;

const mediaCache = new Map<string, number>();
const missingMedia = new Set<string>();

/** Uploads a referenced image once (keyed by filename) and returns its Media id. */
async function media(ref: unknown): Promise<number | undefined> {
  const raw = str(ref);
  if (!raw) return undefined;
  const filename = path.basename(raw);
  if (mediaCache.has(filename)) return mediaCache.get(filename);

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  let id = existing.docs[0]?.id as number | undefined;
  if (!id) {
    const filePath = path.join(MEDIA_SRC, filename);
    if (!fs.existsSync(filePath)) {
      missingMedia.add(filename);
      return undefined;
    }
    const created = await payload.create({
      collection: 'media',
      data: {},
      filePath,
      context: ctx,
    });
    id = created.id as number;
  }
  mediaCache.set(filename, id);
  return id;
}

async function gallery(refs: unknown) {
  if (!Array.isArray(refs)) return undefined;
  const ids = [];
  for (const r of refs) {
    const id = await media(r);
    if (id) ids.push(id);
  }
  return ids.length ? ids : undefined;
}

/**
 * Markdown → Lexical. The markdown converter has no image transformer, so inline images
 * go through as a placeholder paragraph and are swapped for upload nodes afterwards.
 */
async function rich(markdown: unknown) {
  let md = str(markdown);
  if (!md) return undefined;
  const uploads = new Map<string, number>();
  for (const m of md.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const id = await media(m[2]);
    if (!id) continue;
    const token = `IMPORTUPLOAD${id}`;
    uploads.set(token, id);
    md = md.replace(m[0], `\n\n${token}\n\n`);
  }
  const state = convertMarkdownToLexical({ editorConfig, markdown: md });
  if (uploads.size) {
    state.root.children = state.root.children.map((node: any) => {
      const text =
        node.type === 'paragraph' && node.children?.length === 1
          ? node.children[0].text
          : undefined;
      const id = text && uploads.get(text.trim());
      return id
        ? {
            type: 'upload',
            version: 3,
            format: '',
            relationTo: 'media',
            value: id,
            fields: null,
          }
        : node;
    });
  }
  return state;
}

const counts: Record<string, { files: number; upserted: number }> = {};

async function upsert(collection: CollectionSlug, slug: string, data: Data) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
  });
  const doc = { ...data, slug, _status: 'published' };
  const res = existing.docs[0]
    ? await payload.update({
        collection,
        id: existing.docs[0].id,
        data: doc as never,
        locale: 'sl',
        context: ctx,
      })
    : await payload.create({
        collection,
        data: doc as never,
        locale: 'sl',
        context: ctx,
      });
  counts[collection].upserted++;
  return res.id as number;
}

async function importAll(
  collection: CollectionSlug,
  dir: string,
  map: (d: Doc) => Promise<Data>
): Promise<Map<string, number>> {
  const docs = readCollection(dir);
  counts[collection] = { files: docs.length, upserted: 0 };
  const ids = new Map<string, number>();
  for (const d of docs) {
    try {
      ids.set(d.id, await upsert(collection, d.id, await map(d)));
    } catch (err) {
      payload.logger.error({ err }, `${collection}/${d.file} failed`);
    }
  }
  payload.logger.info(
    `${collection}: ${counts[collection].upserted}/${docs.length}`
  );
  return ids;
}

// Staff pages used to render every leftover frontmatter key as a titled markdown section.
const STAFF_BASE = new Set([
  'name',
  'photo',
  'title',
  'role',
  'section',
  'email',
  'phone',
  'office',
  'contactHours',
  'linkedin',
  'cobiss',
]);
const KNOWN_LABELS: Record<string, string> = {
  researchTopics: 'Glavna področja raziskovanja',
  publications: 'Pomembnejše publikacije',
  cv: 'Življenjepis',
  teaching: 'Pedagoško delo',
  projects: 'Projekti',
  editorial: 'Uredništvo',
  awards: 'Nagrade',
  conferenceOrg: 'Organiziranje in vodenje konferenc',
  projectsCollab: 'Mednarodni projekti in sodelovanje',
  reviewerFor: 'Recenzent pri revijah',
  certificates: 'Certifikati',
  zaposlitev: 'Zaposlitev',
  kratkaBiografija: 'Kratka biografija',
  raziskovalnoDelo: 'Raziskovalno delo',
  delovneIzkusnje: 'Delovne izkušnje',
  izobrazevanjeVTujini: 'Izobraževanja v tujini',
  studijInRaziskovanjeVTujini: 'Študij in raziskovanje v tujini',
  studijskeIzmenjave: 'Študijske izmenjave',
  izmenjave: 'Izmenjave',
  vabljenaPredavanja: 'Vabljena predavanja',
  delavniceInVabljenaPredavanja: 'Delavnice in vabljena predavanja',
  izvedbaDelavnic: 'Izvedba delavnic',
  posebnaVabila: 'Posebna vabila',
  organiziranjeInVodenjeKonferenc: 'Organiziranje in vodenje konferenc',
  sodelovanjePriKonferencah: 'Sodelovanje pri konferencah',
  konferencneAktivnosti: 'Konferenčne aktivnosti',
  projektneAktivnosti: 'Projektne aktivnosti',
  vodjaKoordinatorProjekta: 'Vodja/Koordinator projekta',
  sodelovanjePriProjektu: 'Sodelovanje pri projektu',
  recenzijskeInUredniskeAktivnosti: 'Recenzijske in uredniške aktivnosti',
  pedagoskaDejavnost: 'Pedagoška dejavnost',
  mentorstva: 'Mentorstva',
  clanstvo: 'Članstvo',
  clanicaOdborov: 'Članica odborov',
  polozaji: 'Položaji',
  sodelovanjeVDelovihSkupinah: 'Sodelovanje v delovnih skupinah',
  mednarodnaDejavnost: 'Mednarodna dejavnost',
  vMedijih: 'V medijih',
  izobraževanje: 'Izobraževanje',
};
const KNOWN_LABELS_EN: Record<string, string> = {
  researchTopics: 'Main Research Areas',
  publications: 'Selected Publications',
  cv: 'Curriculum Vitae',
  teaching: 'Teaching',
  projects: 'Projects',
  editorial: 'Editorial Activities',
  awards: 'Awards',
  conferenceOrg: 'Conference Organisation',
  projectsCollab: 'International Projects and Collaboration',
  reviewerFor: 'Reviewer for Journals',
  certificates: 'Certificates',
  zaposlitev: 'Employment',
  kratkaBiografija: 'Short Biography',
  raziskovalnoDelo: 'Research Work',
  delovneIzkusnje: 'Work Experience',
  izobrazevanjeVTujini: 'Education Abroad',
  studijInRaziskovanjeVTujini: 'Study and Research Abroad',
  studijskeIzmenjave: 'Study Exchanges',
  izmenjave: 'Exchanges',
  vabljenaPredavanja: 'Invited Lectures',
  delavniceInVabljenaPredavanja: 'Workshops and Invited Lectures',
  izvedbaDelavnic: 'Workshop Delivery',
  posebnaVabila: 'Special Invitations',
  organiziranjeInVodenjeKonferenc: 'Conference Organisation and Chairing',
  sodelovanjePriKonferencah: 'Conference Participation',
  konferencneAktivnosti: 'Conference Activities',
  projektneAktivnosti: 'Project Activities',
  vodjaKoordinatorProjekta: 'Project Leader/Coordinator',
  sodelovanjePriProjektu: 'Project Collaboration',
  recenzijskeInUredniskeAktivnosti: 'Review and Editorial Activities',
  pedagoskaDejavnost: 'Teaching Activities',
  mentorstva: 'Supervision',
  clanstvo: 'Membership',
  clanicaOdborov: 'Committee Membership',
  polozaji: 'Positions',
  sodelovanjeVDelovihSkupinah: 'Working Group Participation',
  mednarodnaDejavnost: 'International Activities',
  vMedijih: 'In the Media',
  izobraževanje: 'Education',
};
const camelToLabel = (key: string, labels = KNOWN_LABELS) =>
  labels[key] ??
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

// ── collections ────────────────────────────────────────────────────────────

async function staffSections(data: Data, labels: Record<string, string>) {
  const sections = [];
  for (const [key, value] of Object.entries(data)) {
    if (STAFF_BASE.has(key) || typeof value !== 'string' || !value.trim())
      continue;
    sections.push({
      heading: camelToLabel(key, labels),
      content: await rich(value),
    });
  }
  return sections;
}

const staffIds = await importAll('staff', 'staff', async ({ data }) => {
  const sections = await staffSections(data, KNOWN_LABELS);
  return {
    name: data.name,
    photo: await media(data.photo),
    title: str(data.title),
    role: str(data.role) ?? '—',
    section: str(data.section),
    email: str(data.email),
    phone: str(data.phone),
    office: str(data.office),
    contactHours: str(data.contactHours),
    linkedin: str(data.linkedin),
    cobiss: str(data.cobiss),
    sections,
  };
});

// The /en/ staff pages showed English section headings; keep them as the EN locale.
for (const d of readCollection('staff')) {
  const id = staffIds.get(d.id);
  if (!id) continue;
  await payload.update({
    collection: 'staff',
    id,
    locale: 'en',
    context: ctx,
    // role/title stay empty in EN so they fall back to the Slovenian text.
    data: {
      role: null,
      title: null,
      sections: await staffSections(d.data, KNOWN_LABELS_EN),
      _status: 'published',
    } as never,
  });
}

const newsIds = await importAll('news', 'news', async ({ data, body }) => ({
  title: data.title,
  date: date(data.date),
  tags: data.tags ?? [],
  summary: str(data.summary) ?? '',
  coverImage: await media(data.coverImage),
  images: await gallery(data.images),
  body: await rich(body),
}));

const achievementIds = await importAll(
  'achievements',
  'achievements',
  async ({ data, body }) => ({
    title: data.title,
    subtitle: str(data.subtitle),
    date: date(data.date),
    tags: data.tags ?? [],
    summary: str(data.summary),
    coverImage: await media(data.coverImage),
    images: await gallery(data.images),
    videos: Array.isArray(data.videos)
      ? data.videos.map((url) => ({ url }))
      : undefined,
    body: await rich(body),
  })
);

const projectIds = await importAll(
  'projects',
  'projects',
  async ({ data, body }) => ({
    title: data.title,
    status: data.status,
    description: data.description,
    startYear: num(data.startYear),
    endYear: num(data.endYear),
    funder: str(data.funder),
    principalInvestigator: str(data.principalInvestigator),
    newsLink: str(data.newsLink),
    body: await rich(body),
  })
);

await importAll('laboratories', 'laboratories', async ({ data, body }) => ({
  name: data.name,
  acronym: str(data.acronym),
  description: data.description,
  researchAreas: Array.isArray(data.researchAreas)
    ? data.researchAreas.map((area) => ({ area }))
    : undefined,
  members: Array.isArray(data.members)
    ? data.members
        .map((m) => staffIds.get(String(m)))
        .filter((id): id is number => Boolean(id))
    : undefined,
  externalUrl: str(data.externalUrl),
  body: await rich(body),
}));

await importAll('conferences', 'conferences', async ({ data, body }) => ({
  name: data.name,
  acronym: str(data.acronym),
  description: data.description,
  date: date(data.date),
  location: str(data.location),
  url: str(data.url),
  body: await rich(body),
}));

await importAll(
  'study-programmes',
  'study-programmes',
  async ({ data, body }) => ({
    title: data.title,
    type: data.type,
    duration: num(data.duration),
    ects: num(data.ects),
    scope: str(data.scope),
    externalUrl: str(data.externalUrl),
    body: await rich(body),
  })
);

await importAll(
  'student-projects',
  'student-projects',
  async ({ data, body }) => ({
    title: data.title,
    student: data.student,
    year: num(data.year),
    description: data.description,
    externalUrl: str(data.externalUrl),
    body: await rich(body),
  })
);

await importAll(
  'interest-groups',
  'interest-groups',
  async ({ data, body }) => ({
    name: data.name,
    description: data.description,
    url: str(data.url),
    body: await rich(body),
  })
);

await importAll('industry-partners', 'industry-partners', async ({ data }) => ({
  name: data.name,
  description: data.description,
  logo: await media(data.logo),
  url: str(data.url),
}));

await importAll('ethics-opinions', 'ethics-opinions', async ({ data }) => ({
  date: date(data.date),
  research: data.research,
  researchers: data.researchers,
  decision: data.decision,
}));

await importAll('hero-slides', 'hero-slides', async ({ data }) => ({
  title: data.title,
  subtitle: data.subtitle,
  image: await media(data.image),
  order: num(data.order) ?? 1,
}));

// ── globals ────────────────────────────────────────────────────────────────

const [about] = readCollection('about');
if (about) {
  await payload.updateGlobal({
    slug: 'about',
    locale: 'sl',
    context: ctx,
    data: {
      title: about.data.title as string,
      subtitle: str(about.data.subtitle),
      contactEmail: str(about.data.contactEmail),
      contactAddress: str(about.data.contactAddress),
      contactPhone: str(about.data.contactPhone),
      contactWebsite: str(about.data.contactWebsite),
      body: await rich(about.body),
    },
  });
}

const [research] = readCollection('research');
if (research) {
  await payload.updateGlobal({
    slug: 'research-group',
    locale: 'sl',
    context: ctx,
    data: { body: await rich(research.body) },
  });
}

const highlightedFile = path.join(CONTENT_DIR, 'config/highlighted.json');
if (fs.existsSync(highlightedFile)) {
  const h = JSON.parse(fs.readFileSync(highlightedFile, 'utf8')) as Record<
    string,
    string[]
  >;
  const resolve = (ids: Map<string, number>, slugs: string[] = [], max = 3) =>
    slugs
      .map((s) => ids.get(astroId(s)))
      .filter((id): id is number => Boolean(id))
      .slice(0, max);
  await payload.updateGlobal({
    slug: 'highlighted',
    context: ctx,
    data: {
      news: resolve(newsIds, h.news, 5),
      achievements: resolve(achievementIds, h.achievements),
      projects: resolve(projectIds, h.projects),
    },
  });
}

// ── report ─────────────────────────────────────────────────────────────────

console.table(counts);
console.log(`media uploaded/linked: ${mediaCache.size}`);
if (missingMedia.size)
  console.warn(`missing media files (${missingMedia.size}):`, [
    ...missingMedia,
  ]);
const failed = Object.entries(counts).filter(([, c]) => c.files !== c.upserted);
process.exit(failed.length ? 1 : 0);

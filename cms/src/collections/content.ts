import type { CollectionConfig } from 'payload';
import { anyone, isLoggedIn, publishedOrLoggedIn } from '../access';
import {
  bodyFields,
  galleryField,
  richTextWithHtml,
  slugField,
  tagsField,
} from '../fields';
import { rebuildHooks } from '../hooks/triggerRebuild';

const editorAccess = {
  create: isLoggedIn,
  update: isLoggedIn,
  delete: isLoggedIn,
};

/** Collections with drafts: the public API only returns published documents. */
const draftable = {
  versions: { drafts: true, maxPerDoc: 25 },
  access: { ...editorAccess, read: publishedOrLoggedIn },
} satisfies Partial<CollectionConfig>;

/** Small collections without drafts: everything saved is live. */
const plain = {
  access: { ...editorAccess, read: anyone },
} satisfies Partial<CollectionConfig>;

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Novica', plural: 'Novice' },
  ...draftable,
  hooks: rebuildHooks,
  defaultSort: '-date',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'tags', '_status'],
    group: 'Vsebina',
  },
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('title'),
    {
      name: 'date',
      label: 'Datum',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { displayFormat: 'd. M. yyyy' } },
    },
    tagsField,
    {
      name: 'summary',
      label: 'Povzetek',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'coverImage',
      label: 'Naslovna slika',
      type: 'upload',
      relationTo: 'media',
    },
    galleryField,
    ...bodyFields,
  ],
};

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  labels: { singular: 'Dosežek', plural: 'Dosežki' },
  ...draftable,
  hooks: rebuildHooks,
  defaultSort: '-date',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'tags', '_status'],
    group: 'Vsebina',
  },
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('title'),
    { name: 'subtitle', label: 'Podnaslov', type: 'text', localized: true },
    {
      name: 'date',
      label: 'Datum',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    tagsField,
    { name: 'summary', label: 'Povzetek', type: 'textarea', localized: true },
    {
      name: 'coverImage',
      label: 'Naslovna slika',
      type: 'upload',
      relationTo: 'media',
    },
    galleryField,
    {
      name: 'videos',
      label: 'Videoposnetki',
      type: 'array',
      admin: {
        description: 'Pot (npr. /assets/media/video.mp4) ali celoten URL.',
      },
      fields: [{ name: 'url', label: 'URL', type: 'text', required: true }],
    },
    ...bodyFields,
  ],
};

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Oseba', plural: 'Osebje' },
  ...draftable,
  hooks: rebuildHooks,
  defaultSort: 'name',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'section', '_status'],
    group: 'Vsebina',
  },
  fields: [
    { name: 'name', label: 'Ime in priimek', type: 'text', required: true },
    slugField('name'),
    {
      name: 'section',
      label: 'Skupina',
      type: 'select',
      options: [
        { label: 'Predstojnik', value: 'predstojnik' },
        { label: 'Profesorji', value: 'profesorji' },
        { label: 'Asistenti', value: 'asistenti' },
        { label: 'Tehnično osebje', value: 'tehnicno' },
        { label: 'Nekdanji sodelavci', value: 'prejsnji' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'photo',
      label: 'Fotografija',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'title', label: 'Naziv', type: 'text', localized: true },
    {
      name: 'role',
      label: 'Vloga',
      type: 'text',
      localized: true,
      // Required in Slovenian only; English falls back to it when left empty.
      validate: (
        value: unknown,
        { req }: { req: { locale?: string | null } }
      ) => req.locale === 'en' || Boolean(value) || 'Vloga je obvezna.',
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'E-pošta', type: 'email' },
        { name: 'phone', label: 'Telefon', type: 'text' },
        { name: 'office', label: 'Prostor', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'contactHours', label: 'Govorilne ure (URL)', type: 'text' },
        { name: 'linkedin', label: 'LinkedIn (URL)', type: 'text' },
        { name: 'cobiss', label: 'COBISS (URL)', type: 'text' },
      ],
    },
    {
      name: 'sections',
      label: 'Sekcije profila',
      labels: { singular: 'Sekcija', plural: 'Sekcije' },
      type: 'array',
      localized: true,
      admin: {
        description:
          'Npr. "Življenjepis", "Pomembnejše publikacije", "Pedagoško delo".',
        initCollapsed: true,
        components: {
          RowLabel: './components/SectionRowLabel#SectionRowLabel',
        },
      },
      fields: [
        { name: 'heading', label: 'Naslov', type: 'text', required: true },
        ...richTextWithHtml('content', 'Vsebina', { required: true }),
      ],
    },
  ],
};

export const Laboratories: CollectionConfig = {
  slug: 'laboratories',
  labels: { singular: 'Laboratorij', plural: 'Laboratoriji' },
  ...plain,
  hooks: rebuildHooks,
  admin: { useAsTitle: 'name', group: 'Raziskovanje' },
  fields: [
    {
      name: 'name',
      label: 'Ime laboratorija',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('name'),
    { name: 'acronym', label: 'Kratica', type: 'text' },
    { name: 'description', label: 'Opis', type: 'textarea', localized: true },
    {
      name: 'researchAreas',
      label: 'Raziskovalna področja',
      type: 'array',
      localized: true,
      fields: [
        { name: 'area', label: 'Področje', type: 'text', required: true },
      ],
    },
    {
      name: 'members',
      label: 'Člani',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: true,
    },
    { name: 'externalUrl', label: 'Zunanja povezava', type: 'text' },
    ...bodyFields,
  ],
};

export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  labels: { singular: 'Drsnik', plural: 'Drsniki (naslovna)' },
  ...plain,
  hooks: rebuildHooks,
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    group: 'Naslovnica',
  },
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('title'),
    {
      name: 'subtitle',
      label: 'Podnaslov',
      type: 'text',
      required: true,
      localized: true,
    },
    { name: 'image', label: 'Slika', type: 'upload', relationTo: 'media' },
    {
      name: 'order',
      label: 'Vrstni red',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 1,
    },
  ],
};

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projekt', plural: 'Projekti' },
  ...plain,
  hooks: rebuildHooks,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'startYear'],
    group: 'Raziskovanje',
  },
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('title'),
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Aktiven', value: 'active' },
        { label: 'Zaključen', value: 'past' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      label: 'Opis',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'startYear', label: 'Začetek (leto)', type: 'number' },
        { name: 'endYear', label: 'Konec (leto)', type: 'number' },
      ],
    },
    { name: 'funder', label: 'Financer', type: 'text' },
    { name: 'principalInvestigator', label: 'Vodja projekta', type: 'text' },
    { name: 'newsLink', label: 'Povezava do novice', type: 'text' },
    ...bodyFields,
  ],
};

export const Conferences: CollectionConfig = {
  slug: 'conferences',
  labels: { singular: 'Konferenca', plural: 'Konference' },
  ...plain,
  hooks: rebuildHooks,
  admin: { useAsTitle: 'name', group: 'Raziskovanje' },
  fields: [
    {
      name: 'name',
      label: 'Ime',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('name'),
    { name: 'acronym', label: 'Kratica', type: 'text' },
    {
      name: 'description',
      label: 'Opis',
      type: 'textarea',
      required: true,
      localized: true,
    },
    { name: 'date', label: 'Datum', type: 'date' },
    { name: 'location', label: 'Lokacija', type: 'text', localized: true },
    { name: 'url', label: 'Spletna stran', type: 'text' },
    ...bodyFields,
  ],
};

export const StudyProgrammes: CollectionConfig = {
  slug: 'study-programmes',
  labels: { singular: 'Študijski program', plural: 'Študijski programi' },
  ...plain,
  hooks: rebuildHooks,
  admin: { useAsTitle: 'title', group: 'Študij' },
  fields: [
    {
      name: 'title',
      label: 'Naziv programa',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('title'),
    {
      name: 'type',
      label: 'Vrsta',
      type: 'select',
      required: true,
      options: ['IPT', 'ITK', 'Bachelor', 'Master', 'PhD'],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'duration',
          label: 'Trajanje (leta)',
          type: 'number',
          required: true,
        },
        { name: 'ects', label: 'ECTS', type: 'number', required: true },
      ],
    },
    { name: 'scope', label: 'Obseg', type: 'text', localized: true },
    { name: 'externalUrl', label: 'Zunanja povezava', type: 'text' },
    ...bodyFields,
  ],
};

export const StudentProjects: CollectionConfig = {
  slug: 'student-projects',
  labels: { singular: 'Študentski projekt', plural: 'Študentski projekti' },
  ...plain,
  hooks: rebuildHooks,
  admin: { useAsTitle: 'title', group: 'Študij' },
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('title'),
    { name: 'student', label: 'Študent', type: 'text', required: true },
    { name: 'year', label: 'Leto', type: 'number', required: true },
    {
      name: 'description',
      label: 'Opis',
      type: 'textarea',
      required: true,
      localized: true,
    },
    { name: 'externalUrl', label: 'Zunanja povezava', type: 'text' },
    ...bodyFields,
  ],
};

export const InterestGroups: CollectionConfig = {
  slug: 'interest-groups',
  labels: { singular: 'Interesna skupina', plural: 'Interesne skupine' },
  ...plain,
  hooks: rebuildHooks,
  admin: { useAsTitle: 'name', group: 'Študij' },
  fields: [
    {
      name: 'name',
      label: 'Ime',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField('name'),
    {
      name: 'description',
      label: 'Opis',
      type: 'textarea',
      required: true,
      localized: true,
    },
    { name: 'url', label: 'Spletna stran', type: 'text' },
    ...bodyFields,
  ],
};

export const IndustryPartners: CollectionConfig = {
  slug: 'industry-partners',
  labels: {
    singular: 'Industrijski partner',
    plural: 'Industrijski partnerji',
  },
  ...plain,
  hooks: rebuildHooks,
  admin: { useAsTitle: 'name', group: 'Sodelovanje' },
  fields: [
    { name: 'name', label: 'Ime', type: 'text', required: true },
    slugField('name'),
    {
      name: 'description',
      label: 'Opis',
      type: 'textarea',
      required: true,
      localized: true,
    },
    { name: 'logo', label: 'Logotip', type: 'upload', relationTo: 'media' },
    { name: 'url', label: 'Spletna stran', type: 'text' },
  ],
};

export const EthicsOpinions: CollectionConfig = {
  slug: 'ethics-opinions',
  labels: { singular: 'Etično mnenje', plural: 'Etična mnenja' },
  ...plain,
  hooks: rebuildHooks,
  defaultSort: '-date',
  admin: {
    useAsTitle: 'research',
    defaultColumns: ['research', 'date', 'decision'],
    group: 'Raziskovanje',
  },
  fields: [
    slugField('research'),
    { name: 'date', label: 'Datum', type: 'date', required: true },
    {
      name: 'research',
      label: 'Naslov raziskave',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'researchers',
      label: 'Raziskovalci',
      type: 'text',
      required: true,
    },
    {
      name: 'decision',
      label: 'Odločitev',
      type: 'textarea',
      required: true,
      localized: true,
    },
  ],
};

export const contentCollections = [
  News,
  Achievements,
  Staff,
  Laboratories,
  Projects,
  Conferences,
  EthicsOpinions,
  StudyProgrammes,
  StudentProjects,
  InterestGroups,
  IndustryPartners,
  HeroSlides,
];

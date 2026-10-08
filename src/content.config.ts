import { defineCollection, z } from 'astro:content';
import {
  clean,
  htmlSameOrigin,
  image,
  images,
  type Locale,
  payloadGlobalLoader,
  payloadLoader,
} from './lib/cms';

const imageSchema = z.object({
  src: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  alt: z.string().optional(),
  srcset: z.string().optional(),
});

const tags = z.array(
  z.enum([
    'student',
    'conference',
    'scientific',
    'professional',
    'project',
    'awards',
    'interest-groups',
  ])
);

type Doc = Record<string, any>;

/**
 * Every collection exists twice: `<name>` (Slovenian) for the default pages and
 * `<name>En` for the /en/ pages. Payload falls back to Slovenian where English is missing.
 */
function localized<S extends z.ZodTypeAny>(
  slug: string,
  schema: S,
  map: (doc: Doc) => Doc
) {
  const make = (locale: Locale) =>
    defineCollection({ loader: payloadLoader(slug, locale, map), schema });
  return [make('sl'), make('en')] as const;
}

const slugOf = (rel: unknown) =>
  rel && typeof rel === 'object' ? (rel as Doc).slug : undefined;

const [news, newsEn] = localized(
  'news',
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags,
    summary: z.string(),
    coverImage: imageSchema.optional(),
    images: z.array(imageSchema).optional(),
  }),
  (d) => ({
    title: d.title,
    date: d.date,
    tags: d.tags ?? [],
    summary: d.summary,
    coverImage: image(d.coverImage),
    images: images(d.images),
  })
);

const [achievements, achievementsEn] = localized(
  'achievements',
  z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date().optional(),
    tags,
    summary: z.string().optional(),
    coverImage: imageSchema.optional(),
    images: z.array(imageSchema).optional(),
    videos: z.array(z.string()).optional(),
  }),
  (d) => ({
    title: d.title,
    subtitle: d.subtitle,
    date: d.date,
    tags: d.tags ?? [],
    summary: d.summary,
    coverImage: image(d.coverImage),
    images: images(d.images),
    videos: d.videos?.map((v: Doc) => v.url),
  })
);

const [staff, staffEn] = localized(
  'staff',
  z.object({
    name: z.string(),
    photo: imageSchema.optional(),
    title: z.string().optional(),
    role: z.string(),
    section: z
      .enum(['predstojnik', 'profesorji', 'asistenti', 'tehnicno', 'prejsnji'])
      .optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    office: z.string().optional(),
    contactHours: z.string().optional(),
    linkedin: z.string().optional(),
    cobiss: z.string().optional(),
    sections: z
      .array(z.object({ heading: z.string(), html: z.string() }))
      .default([]),
  }),
  (d) => ({
    name: d.name,
    photo: image(d.photo),
    title: d.title,
    role: d.role,
    section: d.section,
    email: d.email,
    phone: d.phone,
    office: d.office,
    contactHours: d.contactHours,
    linkedin: d.linkedin,
    cobiss: d.cobiss,
    sections: (d.sections ?? []).map((s: Doc) => ({
      heading: s.heading,
      html: htmlSameOrigin(s.contentHtml),
    })),
  })
);

const [laboratories, laboratoriesEn] = localized(
  'laboratories',
  z.object({
    name: z.string(),
    acronym: z.string().optional(),
    description: z.string().default(''),
    researchAreas: z.array(z.string()).optional(),
    members: z.array(z.string()).optional(),
    externalUrl: z.string().optional(),
  }),
  (d) => ({
    name: d.name,
    acronym: d.acronym,
    description: d.description,
    researchAreas: d.researchAreas?.map((r: Doc) => r.area),
    members: d.members?.map(slugOf).filter(Boolean),
    externalUrl: d.externalUrl,
  })
);

const [projects, projectsEn] = localized(
  'projects',
  z.object({
    title: z.string(),
    status: z.enum(['active', 'past']),
    description: z.string(),
    startYear: z.number().optional(),
    endYear: z.number().optional(),
    funder: z.string().optional(),
    principalInvestigator: z.string().optional(),
    newsLink: z.string().optional(),
  }),
  (d) => ({
    title: d.title,
    status: d.status,
    description: d.description,
    startYear: d.startYear,
    endYear: d.endYear,
    funder: d.funder,
    principalInvestigator: d.principalInvestigator,
    newsLink: d.newsLink,
  })
);

const [conferences, conferencesEn] = localized(
  'conferences',
  z.object({
    name: z.string(),
    acronym: z.string().optional(),
    description: z.string(),
    date: z.coerce.date().optional(),
    location: z.string().optional(),
    url: z.string().optional(),
  }),
  (d) => ({
    name: d.name,
    acronym: d.acronym,
    description: d.description,
    date: d.date,
    location: d.location,
    url: d.url,
  })
);

const [studyProgrammes, studyProgrammesEn] = localized(
  'study-programmes',
  z.object({
    title: z.string(),
    type: z.enum(['IPT', 'ITK', 'Bachelor', 'Master', 'PhD']),
    duration: z.number(),
    ects: z.number(),
    scope: z.string().optional(),
    externalUrl: z.string().optional(),
  }),
  (d) => ({
    title: d.title,
    type: d.type,
    duration: d.duration,
    ects: d.ects,
    scope: d.scope,
    externalUrl: d.externalUrl,
  })
);

const [studentProjects, studentProjectsEn] = localized(
  'student-projects',
  z.object({
    title: z.string(),
    student: z.string(),
    year: z.number(),
    description: z.string(),
    externalUrl: z.string().optional(),
  }),
  (d) => ({
    title: d.title,
    student: d.student,
    year: d.year,
    description: d.description,
    externalUrl: d.externalUrl,
  })
);

const [interestGroups, interestGroupsEn] = localized(
  'interest-groups',
  z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
  }),
  (d) => ({ name: d.name, description: d.description, url: d.url })
);

const [industryPartners, industryPartnersEn] = localized(
  'industry-partners',
  z.object({
    name: z.string(),
    description: z.string(),
    logo: imageSchema.optional(),
    url: z.string().optional(),
  }),
  (d) => ({
    name: d.name,
    description: d.description,
    logo: image(d.logo),
    url: d.url,
  })
);

const [ethicsOpinions, ethicsOpinionsEn] = localized(
  'ethics-opinions',
  z.object({
    date: z.coerce.date(),
    research: z.string(),
    researchers: z.string(),
    decision: z.string(),
  }),
  (d) => ({
    date: d.date,
    research: d.research,
    researchers: d.researchers,
    decision: d.decision,
  })
);

const [heroSlides, heroSlidesEn] = localized(
  'hero-slides',
  z.object({
    title: z.string(),
    subtitle: z.string(),
    image: imageSchema.optional(),
    order: z.coerce.number().min(1),
  }),
  (d) => ({
    title: d.title,
    subtitle: d.subtitle,
    image: image(d.image),
    order: d.order,
  })
);

// Singletons keep the entry ids the pages already ask for (getEntry('about', 'institute')).
const about = defineCollection({
  loader: payloadGlobalLoader('about', 'institute', 'sl', (d) =>
    clean({
      title: d.title,
      subtitle: d.subtitle,
      contactEmail: d.contactEmail,
      contactAddress: d.contactAddress,
      contactPhone: d.contactPhone,
      contactWebsite: d.contactWebsite,
    })
  ),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    contactEmail: z.string().optional(),
    contactAddress: z.string().optional(),
    contactPhone: z.string().optional(),
    contactWebsite: z.string().optional(),
  }),
});

const research = defineCollection({
  loader: payloadGlobalLoader('research-group', 'group', 'sl', () => ({})),
  schema: z.object({}),
});

const highlighted = defineCollection({
  loader: payloadGlobalLoader('highlighted', 'config', 'sl', (d) => ({
    news: (d.news ?? []).map(slugOf).filter(Boolean),
    achievements: (d.achievements ?? []).map(slugOf).filter(Boolean),
    projects: (d.projects ?? []).map(slugOf).filter(Boolean),
  })),
  schema: z.object({
    news: z.array(z.string()),
    achievements: z.array(z.string()),
    projects: z.array(z.string()),
  }),
});

export const collections = {
  about,
  research,
  highlighted,
  news,
  newsEn,
  achievements,
  achievementsEn,
  staff,
  staffEn,
  laboratories,
  laboratoriesEn,
  projects,
  projectsEn,
  conferences,
  conferencesEn,
  studyProgrammes,
  studyProgrammesEn,
  studentProjects,
  studentProjectsEn,
  interestGroups,
  interestGroupsEn,
  industryPartners,
  industryPartnersEn,
  ethicsOpinions,
  ethicsOpinionsEn,
  heroSlides,
  heroSlidesEn,
};

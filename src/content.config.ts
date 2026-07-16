import { defineCollection, z } from 'astro:content';
import { sveltiaLoader } from 'astro-loader-sveltia-cms/loader';

const laboratories = defineCollection({
  loader: sveltiaLoader('laboratories'),
  schema: z.object({
    name: z.string(),
    acronym: z.string().optional(),
    description: z.string(),
    researchAreas: z.array(z.string()).optional(),
    members: z.array(z.string()).optional(),
    externalUrl: z.string().optional(),
    body: z.string().optional(),
  }),
});

const interestGroups = defineCollection({
  loader: sveltiaLoader('interestGroups'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    body: z.string().optional(),
  }),
});

const ethicsOpinions = defineCollection({
  loader: sveltiaLoader('ethicsOpinions'),
});

const studyProgrammes = defineCollection({
  loader: sveltiaLoader('studyProgrammes'),
  schema: z.object({
    title: z.string(),
    type: z.enum(['IPT', 'ITK', 'Bachelor', 'Master', 'PhD']),
    duration: z.number(),
    ects: z.number(),
    scope: z.string().optional(),
    externalUrl: z.string().optional(),
    body: z.string().optional(),
  }),
});

const studentProjects = defineCollection({
  loader: sveltiaLoader('studentProjects'),
  schema: z.object({
    title: z.string(),
    student: z.string(),
    year: z.number(),
    description: z.string(),
    externalUrl: z.string().optional(),
    body: z.string().optional(),
  }),
});

const conferences = defineCollection({
  loader: sveltiaLoader('conferences'),
  schema: z.object({
    name: z.string(),
    acronym: z.string().optional(),
    description: z.string(),
    date: z.coerce.date().optional(),
    location: z.string().optional(),
    url: z.string().optional(),
    body: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: sveltiaLoader('projects'),
  schema: z.object({
    title: z.string(),
    status: z.enum(['active', 'past']),
    description: z.string(),
    startYear: z.number().optional(),
    endYear: z.number().optional(),
    funder: z.string().optional(),
    principalInvestigator: z.string().optional(),
    newsLink: z.string().optional(),
    body: z.string().optional(),
  }),
});

const staff = defineCollection({
  loader: sveltiaLoader('staff'),
  schema: ({ image }) =>
    z
      .object({
        name: z.string(),
        photo: image().optional(),
        title: z.string().optional(),
        role: z.string(),
        section: z
          .enum([
            'predstojnik',
            'profesorji',
            'asistenti',
            'tehnicno',
            'prejsnji',
          ])
          .optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        office: z.string().optional(),
        contactHours: z.string().optional(),
        linkedin: z.string().optional(),
        cobiss: z.string().optional(),
      })
      .passthrough(),
});

const industryPartners = defineCollection({
  loader: sveltiaLoader('industryPartners'),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      logo: image().optional(),
      url: z.string().optional(),
    }),
});

const news = defineCollection({
  loader: sveltiaLoader('news'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(
        z.enum([
          'student',
          'conference',
          'scientific',
          'professional',
          'project',
          'awards',
          'interest-groups',
        ])
      ),
      summary: z.string(),
      coverImage: image().optional(),
      images: z.array(image()).optional(),
    }),
});

const achievements = defineCollection({
  loader: sveltiaLoader('achievements'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      date: z.coerce.date().optional(),
      tags: z.array(
        z.enum([
          'student',
          'conference',
          'scientific',
          'professional',
          'project',
          'awards',
          'interest-groups',
        ])
      ),
      summary: z.string().optional(),
      coverImage: image().optional(),
      images: z.array(image()).optional(),
      videos: z.array(z.string()).optional(),
    }),
});

const about = defineCollection({
  loader: sveltiaLoader('about'),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    contactEmail: z.string().optional(),
    contactAddress: z.string().optional(),
    contactPhone: z.string().optional(),
    contactWebsite: z.string().optional(),
    body: z.string().optional(),
  }),
});

const heroSlides = defineCollection({
  loader: sveltiaLoader('heroSlides'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      image: image().optional(),
      order: z.coerce.number().min(1),
    }),
});

export const collections = {
  about,
  laboratories,
  interestGroups,
  staff,
  projects,
  ethicsOpinions,
  studyProgrammes,
  studentProjects,
  conferences,
  industryPartners,
  achievements,
  news,
  heroSlides,
};

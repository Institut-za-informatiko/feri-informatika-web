import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { en } from '@payloadcms/translations/languages/en';
import { sl } from '@payloadcms/translations/languages/sl';
import { buildConfig, type SharpDependency } from 'payload';
import sharp from 'sharp';

import { contentCollections } from './collections/content';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { globals } from './globals';
import {
  collectionPreviewUrl,
  globalPreviewUrl,
  hasCollectionPreview,
} from './lib/preview';
import { migrations } from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

export default buildConfig({
  serverURL,
  routes: { admin: '/admin', api: '/api' },
  admin: {
    user: Users.slug,
    components: {
      // Passwordless sign-in (Better Auth magic link) in place of the password form.
      beforeLogin: ['@/components/admin/MagicLinkLogin#MagicLinkLogin'],
      graphics: {
        Logo: '@/components/admin/Brand#Logo',
        Icon: '@/components/admin/Brand#Icon',
      },
    },
    // Live Preview: the real page in draft mode next to the editor (Payload docs).
    livePreview: {
      url: ({ data, collectionConfig, globalConfig, locale }) =>
        (collectionConfig
          ? collectionPreviewUrl(collectionConfig.slug, data, locale?.code)
          : globalConfig
            ? globalPreviewUrl(globalConfig.slug, locale?.code)
            : null) ?? '',
      collections: [
        'news',
        'achievements',
        'staff',
        'pages',
        'projects',
        'laboratories',
      ],
      globals: ['about', 'research-group'],
      breakpoints: [
        { label: 'Telefon', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablica', name: 'tablet', width: 820, height: 1180 },
        { label: 'Računalnik', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    meta: { titleSuffix: ' · Inštitut za informatiko' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: {
    supportedLanguages: { sl, en },
    fallbackLanguage: 'sl',
  },
  localization: {
    locales: [
      { label: 'Slovenščina', code: 'sl' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'sl',
    fallback: true,
  },
  // "Preview" button on every collection that has a public page.
  collections: [...contentCollections, Media, Users].map((c) =>
    hasCollectionPreview(c.slug)
      ? {
          ...c,
          admin: {
            ...c.admin,
            preview: (doc, { locale }) =>
              collectionPreviewUrl(c.slug, doc, locale),
          },
        }
      : c
  ),
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  csrf: [serverURL],
  cors: [serverURL],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Schema changes ship as committed migrations (src/migrations) and run on container start.
    push: false,
    prodMigrations: migrations,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  // sharp 0.35 widened its input type; Payload's SharpDependency still describes 0.34.
  sharp: sharp as unknown as SharpDependency,
  graphQL: { disable: true },
  telemetry: false,
});

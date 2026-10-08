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
import { migrations } from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

export default buildConfig({
  serverURL,
  routes: { admin: '/admin', api: '/api' },
  admin: {
    user: Users.slug,
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
  collections: [...contentCollections, Media, Users],
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

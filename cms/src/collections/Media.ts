import type { CollectionConfig } from 'payload';
import { anyone, isLoggedIn } from '../access';
import { rebuildHooks } from '../hooks/triggerRebuild';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Medij', plural: 'Mediji' },
  admin: { group: 'Vsebina' },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: rebuildHooks,
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    // The static site renders <img srcset> from these, so it never resizes images itself.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 800,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'large',
        width: 1600,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      label: 'Opis slike (alt)',
      type: 'text',
      localized: true,
      admin: { description: 'Kratek opis za bralnike zaslona.' },
    },
  ],
};

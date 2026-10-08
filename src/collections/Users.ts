import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminField, isAdminOrSelf } from '../access';

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Uporabnik', plural: 'Uporabniki' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    group: 'Administracija',
  },
  auth: {
    maxLoginAttempts: 10,
    lockTime: 15 * 60 * 1000,
  },
  // No public sign-up: only admins create accounts.
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      // The very first account (created via /admin on an empty DB) must be able to manage users.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
          req,
        });
        return totalDocs === 0 ? { ...data, role: 'admin' } : data;
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Ime in priimek', type: 'text' },
    {
      name: 'role',
      label: 'Vloga',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Urednik', value: 'editor' },
      ],
      access: { update: isAdminField, create: isAdminField },
      admin: {
        description:
          'Uredniki urejajo vsebino. Administratorji upravljajo tudi uporabnike.',
      },
    },
  ],
};

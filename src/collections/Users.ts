import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminField, isAdminOrSelf } from '../access';
import { auth } from '../lib/auth/server';
import { betterAuthStrategy } from '../lib/auth/strategy';

/**
 * CMS accounts. There are no passwords: people sign in with an emailed link (Better Auth),
 * and only addresses listed here — and marked active — can sign in.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Uporabnik', plural: 'Uporabniki' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'active'],
    group: 'Administracija',
    description:
      'Kdo se lahko prijavi v CMS. Prijava poteka s povezavo, ki jo uporabnik prejme po e-pošti.',
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [betterAuthStrategy],
  },
  // No public sign-up: only admins create accounts.
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  endpoints: [
    {
      // The admin panel's "Log out" posts here; end the Better Auth session (and its cookie).
      path: '/logout',
      method: 'post',
      handler: async (req) => {
        const res = await auth.api.signOut({
          headers: req.headers,
          asResponse: true,
        });
        return Response.json(
          { message: 'Logged out' },
          { headers: res.headers }
        );
      },
    },
  ],
  hooks: {
    beforeChange: [
      // The very first account must be able to manage users.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
          req,
        });
        return totalDocs === 0 ? { ...data, role: 'admin' } : data;
      },
      // Sign-in matches on the address exactly, so store it normalised.
      ({ data }) =>
        typeof data?.email === 'string'
          ? { ...data, email: data.email.trim().toLowerCase() }
          : data,
    ],
  },
  fields: [
    {
      name: 'email',
      label: 'E-pošta',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      access: { update: isAdminField },
    },
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
    {
      // Managed by Better Auth, not stored on this collection; shown on the user's own account.
      name: 'passkeys',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/PasskeyManager#PasskeyManager',
        },
      },
    },
    {
      name: 'active',
      label: 'Lahko se prijavi',
      type: 'checkbox',
      defaultValue: true,
      access: { update: isAdminField, create: isAdminField },
      admin: {
        position: 'sidebar',
        description: 'Izklop takoj odjavi uporabnika in prepreči nove prijave.',
      },
    },
  ],
};

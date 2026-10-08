import type { Field, GlobalConfig } from 'payload';
import { anyone, isLoggedIn } from '../access';
import { bodyField } from '../fields';
import { revalidateGlobal } from '../hooks/revalidate';

const access = { read: anyone, update: isLoggedIn };
const hooks = { afterChange: [revalidateGlobal] };

export const About: GlobalConfig = {
  slug: 'about',
  label: 'O inštitutu',
  admin: { group: 'Strani' },
  access,
  hooks,
  fields: [
    {
      name: 'title',
      label: 'Naslov',
      type: 'text',
      required: true,
      localized: true,
    },
    { name: 'subtitle', label: 'Podnaslov', type: 'text', localized: true },
    {
      type: 'collapsible',
      label: 'Kontakt',
      fields: [
        { name: 'contactEmail', label: 'E-pošta', type: 'text' },
        { name: 'contactAddress', label: 'Naslov', type: 'text' },
        { name: 'contactPhone', label: 'Telefon', type: 'text' },
        { name: 'contactWebsite', label: 'Spletna stran', type: 'text' },
      ],
    },
    bodyField,
  ],
};

export const ResearchGroup: GlobalConfig = {
  slug: 'research-group',
  label: 'Raziskovalna skupina',
  admin: { group: 'Strani' },
  access,
  hooks,
  fields: [bodyField],
};

const pick = (
  name: string,
  label: string,
  relationTo: 'news' | 'achievements' | 'projects',
  maxRows = 3
): Field => ({
  name,
  label,
  type: 'relationship',
  relationTo,
  hasMany: true,
  minRows: 2,
  maxRows,
});

export const Highlighted: GlobalConfig = {
  slug: 'highlighted',
  label: 'Izpostavljeno (naslovnica)',
  admin: { group: 'Naslovnica' },
  access,
  hooks,
  fields: [
    pick('news', 'Izpostavljene novice', 'news', 5),
    pick('achievements', 'Izpostavljeni dosežki', 'achievements'),
    pick('projects', 'Izpostavljeni projekti', 'projects'),
  ],
};

export const globals = [About, ResearchGroup, Highlighted];

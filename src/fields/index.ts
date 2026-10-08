import type { Field } from 'payload';

/** URL segment of the entry. Imported content keeps its markdown filename, so URLs do not change. */
export const slugField = (from: string): Field => ({
  name: 'slug',
  label: 'Slug (URL)',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: `Del URL-ja. Če ga pustiš praznega, se ustvari iz polja "${from}".`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return value.trim();
        const source = data?.[from];
        const text = typeof source === 'string' ? source : (source?.sl ?? '');
        return slugify(text);
      },
    ],
  },
});

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const tagOptions = [
  { label: 'Študentske', value: 'student' },
  { label: 'Konference', value: 'conference' },
  { label: 'Znanstvene', value: 'scientific' },
  { label: 'Strokovne', value: 'professional' },
  { label: 'Projekti', value: 'project' },
  { label: 'Nagrade', value: 'awards' },
  { label: 'Interesne skupine', value: 'interest-groups' },
];

export const tagsField: Field = {
  name: 'tags',
  label: 'Oznake',
  type: 'select',
  hasMany: true,
  options: tagOptions,
  admin: { position: 'sidebar' },
};

export const bodyField: Field = {
  name: 'body',
  label: 'Vsebina',
  type: 'richText',
  localized: true,
};

export const galleryField: Field = {
  name: 'images',
  label: 'Galerija',
  type: 'upload',
  relationTo: 'media',
  hasMany: true,
};

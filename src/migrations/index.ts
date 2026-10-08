import * as migration_20261008_083403_initial from './20261008_083403_initial';
import * as migration_20261008_083920_lab_description_optional_hero_slug from './20261008_083920_lab_description_optional_hero_slug';
import * as migration_20261008_094049_pages_collection from './20261008_094049_pages_collection';

export const migrations = [
  {
    up: migration_20261008_083403_initial.up,
    down: migration_20261008_083403_initial.down,
    name: '20261008_083403_initial',
  },
  {
    up: migration_20261008_083920_lab_description_optional_hero_slug.up,
    down: migration_20261008_083920_lab_description_optional_hero_slug.down,
    name: '20261008_083920_lab_description_optional_hero_slug',
  },
  {
    up: migration_20261008_094049_pages_collection.up,
    down: migration_20261008_094049_pages_collection.down,
    name: '20261008_094049_pages_collection'
  },
];

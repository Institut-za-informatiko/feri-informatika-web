import * as migration_20261008_083403_initial from './20261008_083403_initial';
import * as migration_20261008_083920_lab_description_optional_hero_slug from './20261008_083920_lab_description_optional_hero_slug';
import * as migration_20261008_094049_pages_collection from './20261008_094049_pages_collection';
import * as migration_20261008_102112_page_globals_drafts from './20261008_102112_page_globals_drafts';
import * as migration_20261008_104359_users_passwordless from './20261008_104359_users_passwordless';
import * as migration_20261008_105609_better_auth_passkeys from './20261008_105609_better_auth_passkeys';
import * as migration_20261008_142309_staff_title_before_after from './20261008_142309_staff_title_before_after';

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
    name: '20261008_094049_pages_collection',
  },
  {
    up: migration_20261008_102112_page_globals_drafts.up,
    down: migration_20261008_102112_page_globals_drafts.down,
    name: '20261008_102112_page_globals_drafts',
  },
  {
    up: migration_20261008_104359_users_passwordless.up,
    down: migration_20261008_104359_users_passwordless.down,
    name: '20261008_104359_users_passwordless',
  },
  {
    up: migration_20261008_105609_better_auth_passkeys.up,
    down: migration_20261008_105609_better_auth_passkeys.down,
    name: '20261008_105609_better_auth_passkeys',
  },
  {
    up: migration_20261008_142309_staff_title_before_after.up,
    down: migration_20261008_142309_staff_title_before_after.down,
    name: '20261008_142309_staff_title_before_after'
  },
];

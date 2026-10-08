import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_research_group_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__research_group_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__research_group_v_published_locale" AS ENUM('sl', 'en');
  CREATE TABLE "_about_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_contact_email" varchar,
  	"version_contact_address" varchar,
  	"version_contact_phone" varchar,
  	"version_contact_website" varchar,
  	"version__status" "enum__about_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__about_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_about_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_research_group_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__research_group_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__research_group_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_research_group_v_locales" (
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "about_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "_pages_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_news_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_achievements_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "_staff_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "about" ADD COLUMN "_status" "enum_about_status" DEFAULT 'draft';
  ALTER TABLE "research_group" ADD COLUMN "_status" "enum_research_group_status" DEFAULT 'draft';
  -- Existing content was live before drafts existed; keep it published.
  UPDATE "about" SET "_status" = 'published';
  UPDATE "research_group" SET "_status" = 'published';
  ALTER TABLE "_about_v_locales" ADD CONSTRAINT "_about_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_research_group_v_locales" ADD CONSTRAINT "_research_group_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_research_group_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_about_v_version_version__status_idx" ON "_about_v" USING btree ("version__status");
  CREATE INDEX "_about_v_created_at_idx" ON "_about_v" USING btree ("created_at");
  CREATE INDEX "_about_v_updated_at_idx" ON "_about_v" USING btree ("updated_at");
  CREATE INDEX "_about_v_snapshot_idx" ON "_about_v" USING btree ("snapshot");
  CREATE INDEX "_about_v_published_locale_idx" ON "_about_v" USING btree ("published_locale");
  CREATE INDEX "_about_v_latest_idx" ON "_about_v" USING btree ("latest");
  CREATE INDEX "_about_v_autosave_idx" ON "_about_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_about_v_locales_locale_parent_id_unique" ON "_about_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_research_group_v_version_version__status_idx" ON "_research_group_v" USING btree ("version__status");
  CREATE INDEX "_research_group_v_created_at_idx" ON "_research_group_v" USING btree ("created_at");
  CREATE INDEX "_research_group_v_updated_at_idx" ON "_research_group_v" USING btree ("updated_at");
  CREATE INDEX "_research_group_v_snapshot_idx" ON "_research_group_v" USING btree ("snapshot");
  CREATE INDEX "_research_group_v_published_locale_idx" ON "_research_group_v" USING btree ("published_locale");
  CREATE INDEX "_research_group_v_latest_idx" ON "_research_group_v" USING btree ("latest");
  CREATE INDEX "_research_group_v_autosave_idx" ON "_research_group_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_research_group_v_locales_locale_parent_id_unique" ON "_research_group_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "_achievements_v_autosave_idx" ON "_achievements_v" USING btree ("autosave");
  CREATE INDEX "_staff_v_autosave_idx" ON "_staff_v" USING btree ("autosave");
  CREATE INDEX "about__status_idx" ON "about" USING btree ("_status");
  CREATE INDEX "research_group__status_idx" ON "research_group" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_about_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_research_group_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_research_group_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_about_v" CASCADE;
  DROP TABLE "_about_v_locales" CASCADE;
  DROP TABLE "_research_group_v" CASCADE;
  DROP TABLE "_research_group_v_locales" CASCADE;
  DROP INDEX "_pages_v_autosave_idx";
  DROP INDEX "_news_v_autosave_idx";
  DROP INDEX "_achievements_v_autosave_idx";
  DROP INDEX "_staff_v_autosave_idx";
  DROP INDEX "about__status_idx";
  DROP INDEX "research_group__status_idx";
  ALTER TABLE "about_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_pages_v" DROP COLUMN "autosave";
  ALTER TABLE "_news_v" DROP COLUMN "autosave";
  ALTER TABLE "_achievements_v" DROP COLUMN "autosave";
  ALTER TABLE "_staff_v" DROP COLUMN "autosave";
  ALTER TABLE "about" DROP COLUMN "_status";
  ALTER TABLE "research_group" DROP COLUMN "_status";
  DROP TYPE "public"."enum_about_status";
  DROP TYPE "public"."enum__about_v_version_status";
  DROP TYPE "public"."enum__about_v_published_locale";
  DROP TYPE "public"."enum_research_group_status";
  DROP TYPE "public"."enum__research_group_v_version_status";
  DROP TYPE "public"."enum__research_group_v_published_locale";`)
}

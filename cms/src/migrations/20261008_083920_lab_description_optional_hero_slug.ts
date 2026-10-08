import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "laboratories_locales" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "news" ADD COLUMN "body_html" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_body_html" varchar;
  ALTER TABLE "achievements" ADD COLUMN "body_html" varchar;
  ALTER TABLE "_achievements_v" ADD COLUMN "version_body_html" varchar;
  ALTER TABLE "staff_sections" ADD COLUMN "content_html" varchar;
  ALTER TABLE "_staff_v_version_sections" ADD COLUMN "content_html" varchar;
  ALTER TABLE "laboratories" ADD COLUMN "body_html" varchar;
  ALTER TABLE "projects" ADD COLUMN "body_html" varchar;
  ALTER TABLE "conferences" ADD COLUMN "body_html" varchar;
  ALTER TABLE "study_programmes" ADD COLUMN "body_html" varchar;
  ALTER TABLE "student_projects" ADD COLUMN "body_html" varchar;
  ALTER TABLE "interest_groups" ADD COLUMN "body_html" varchar;
  ALTER TABLE "hero_slides" ADD COLUMN "slug" varchar NOT NULL;
  ALTER TABLE "about" ADD COLUMN "body_html" varchar;
  ALTER TABLE "research_group" ADD COLUMN "body_html" varchar;
  CREATE UNIQUE INDEX "hero_slides_slug_idx" ON "hero_slides" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "hero_slides_slug_idx";
  ALTER TABLE "laboratories_locales" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "news" DROP COLUMN "body_html";
  ALTER TABLE "_news_v" DROP COLUMN "version_body_html";
  ALTER TABLE "achievements" DROP COLUMN "body_html";
  ALTER TABLE "_achievements_v" DROP COLUMN "version_body_html";
  ALTER TABLE "staff_sections" DROP COLUMN "content_html";
  ALTER TABLE "_staff_v_version_sections" DROP COLUMN "content_html";
  ALTER TABLE "laboratories" DROP COLUMN "body_html";
  ALTER TABLE "projects" DROP COLUMN "body_html";
  ALTER TABLE "conferences" DROP COLUMN "body_html";
  ALTER TABLE "study_programmes" DROP COLUMN "body_html";
  ALTER TABLE "student_projects" DROP COLUMN "body_html";
  ALTER TABLE "interest_groups" DROP COLUMN "body_html";
  ALTER TABLE "hero_slides" DROP COLUMN "slug";
  ALTER TABLE "about" DROP COLUMN "body_html";
  ALTER TABLE "research_group" DROP COLUMN "body_html";`)
}

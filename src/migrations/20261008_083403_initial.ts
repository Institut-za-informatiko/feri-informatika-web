import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_news_tags" AS ENUM('student', 'conference', 'scientific', 'professional', 'project', 'awards', 'interest-groups');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_tags" AS ENUM('student', 'conference', 'scientific', 'professional', 'project', 'awards', 'interest-groups');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_achievements_tags" AS ENUM('student', 'conference', 'scientific', 'professional', 'project', 'awards', 'interest-groups');
  CREATE TYPE "public"."enum_achievements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__achievements_v_version_tags" AS ENUM('student', 'conference', 'scientific', 'professional', 'project', 'awards', 'interest-groups');
  CREATE TYPE "public"."enum__achievements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__achievements_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_staff_section" AS ENUM('predstojnik', 'profesorji', 'asistenti', 'tehnicno', 'prejsnji');
  CREATE TYPE "public"."enum_staff_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__staff_v_version_section" AS ENUM('predstojnik', 'profesorji', 'asistenti', 'tehnicno', 'prejsnji');
  CREATE TYPE "public"."enum__staff_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__staff_v_published_locale" AS ENUM('sl', 'en');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('active', 'past');
  CREATE TYPE "public"."enum_study_programmes_type" AS ENUM('IPT', 'ITK', 'Bachelor', 'Master', 'PhD');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "news_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_news_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_news_v_version_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__news_v_version_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_cover_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "achievements_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_achievements_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "achievements_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "achievements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_achievements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "achievements_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "achievements_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_achievements_v_version_tags" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__achievements_v_version_tags",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_achievements_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_achievements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_cover_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__achievements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__achievements_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_achievements_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_achievements_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "staff_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"section" "enum_staff_section",
  	"photo_id" integer,
  	"email" varchar,
  	"phone" varchar,
  	"office" varchar,
  	"contact_hours" varchar,
  	"linkedin" varchar,
  	"cobiss" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_staff_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "staff_locales" (
  	"title" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_staff_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_staff_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_section" "enum__staff_v_version_section",
  	"version_photo_id" integer,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_office" varchar,
  	"version_contact_hours" varchar,
  	"version_linkedin" varchar,
  	"version_cobiss" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__staff_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__staff_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_staff_v_locales" (
  	"version_title" varchar,
  	"version_role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "laboratories_research_areas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"area" varchar NOT NULL
  );
  
  CREATE TABLE "laboratories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"acronym" varchar,
  	"external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "laboratories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "laboratories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"staff_id" integer
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_projects_status" DEFAULT 'active' NOT NULL,
  	"start_year" numeric,
  	"end_year" numeric,
  	"funder" varchar,
  	"principal_investigator" varchar,
  	"news_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "conferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"acronym" varchar,
  	"date" timestamp(3) with time zone,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conferences_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"location" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ethics_opinions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"researchers" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ethics_opinions_locales" (
  	"research" varchar NOT NULL,
  	"decision" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "study_programmes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_study_programmes_type" NOT NULL,
  	"duration" numeric NOT NULL,
  	"ects" numeric NOT NULL,
  	"external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "study_programmes_locales" (
  	"title" varchar NOT NULL,
  	"scope" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "student_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"student" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "student_projects_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "interest_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "interest_groups_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "industry_partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "industry_partners_locales" (
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hero_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 1 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hero_slides_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_id" integer,
  	"achievements_id" integer,
  	"staff_id" integer,
  	"laboratories_id" integer,
  	"projects_id" integer,
  	"conferences_id" integer,
  	"ethics_opinions_id" integer,
  	"study_programmes_id" integer,
  	"student_projects_id" integer,
  	"interest_groups_id" integer,
  	"industry_partners_id" integer,
  	"hero_slides_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"contact_address" varchar,
  	"contact_phone" varchar,
  	"contact_website" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "research_group" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "research_group_locales" (
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "highlighted" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "highlighted_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_id" integer,
  	"achievements_id" integer,
  	"projects_id" integer
  );
  
  ALTER TABLE "news_tags" ADD CONSTRAINT "news_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_version_tags" ADD CONSTRAINT "_news_v_version_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "achievements_tags" ADD CONSTRAINT "achievements_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "achievements_videos" ADD CONSTRAINT "achievements_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "achievements" ADD CONSTRAINT "achievements_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "achievements_locales" ADD CONSTRAINT "achievements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "achievements_rels" ADD CONSTRAINT "achievements_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "achievements_rels" ADD CONSTRAINT "achievements_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_achievements_v_version_tags" ADD CONSTRAINT "_achievements_v_version_tags_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_achievements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_achievements_v_version_videos" ADD CONSTRAINT "_achievements_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_achievements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_achievements_v" ADD CONSTRAINT "_achievements_v_parent_id_achievements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."achievements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_achievements_v" ADD CONSTRAINT "_achievements_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_achievements_v_locales" ADD CONSTRAINT "_achievements_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_achievements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_achievements_v_rels" ADD CONSTRAINT "_achievements_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_achievements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_achievements_v_rels" ADD CONSTRAINT "_achievements_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff_sections" ADD CONSTRAINT "staff_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_locales" ADD CONSTRAINT "staff_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_staff_v_version_sections" ADD CONSTRAINT "_staff_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_staff_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_staff_v" ADD CONSTRAINT "_staff_v_parent_id_staff_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_staff_v" ADD CONSTRAINT "_staff_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_staff_v_locales" ADD CONSTRAINT "_staff_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_staff_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "laboratories_research_areas" ADD CONSTRAINT "laboratories_research_areas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."laboratories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "laboratories_locales" ADD CONSTRAINT "laboratories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."laboratories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "laboratories_rels" ADD CONSTRAINT "laboratories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."laboratories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "laboratories_rels" ADD CONSTRAINT "laboratories_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "conferences_locales" ADD CONSTRAINT "conferences_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ethics_opinions_locales" ADD CONSTRAINT "ethics_opinions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ethics_opinions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "study_programmes_locales" ADD CONSTRAINT "study_programmes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."study_programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "student_projects_locales" ADD CONSTRAINT "student_projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."student_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "interest_groups_locales" ADD CONSTRAINT "interest_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."interest_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industry_partners" ADD CONSTRAINT "industry_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "industry_partners_locales" ADD CONSTRAINT "industry_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."industry_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_slides_locales" ADD CONSTRAINT "hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_achievements_fk" FOREIGN KEY ("achievements_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_laboratories_fk" FOREIGN KEY ("laboratories_id") REFERENCES "public"."laboratories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conferences_fk" FOREIGN KEY ("conferences_id") REFERENCES "public"."conferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ethics_opinions_fk" FOREIGN KEY ("ethics_opinions_id") REFERENCES "public"."ethics_opinions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_study_programmes_fk" FOREIGN KEY ("study_programmes_id") REFERENCES "public"."study_programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_student_projects_fk" FOREIGN KEY ("student_projects_id") REFERENCES "public"."student_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_interest_groups_fk" FOREIGN KEY ("interest_groups_id") REFERENCES "public"."interest_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industry_partners_fk" FOREIGN KEY ("industry_partners_id") REFERENCES "public"."industry_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_slides_fk" FOREIGN KEY ("hero_slides_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "research_group_locales" ADD CONSTRAINT "research_group_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."research_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "highlighted_rels" ADD CONSTRAINT "highlighted_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."highlighted"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "highlighted_rels" ADD CONSTRAINT "highlighted_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "highlighted_rels" ADD CONSTRAINT "highlighted_rels_achievements_fk" FOREIGN KEY ("achievements_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "highlighted_rels" ADD CONSTRAINT "highlighted_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "news_tags_order_idx" ON "news_tags" USING btree ("order");
  CREATE INDEX "news_tags_parent_idx" ON "news_tags" USING btree ("parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_cover_image_idx" ON "news" USING btree ("cover_image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_media_id_idx" ON "news_rels" USING btree ("media_id");
  CREATE INDEX "_news_v_version_tags_order_idx" ON "_news_v_version_tags" USING btree ("order");
  CREATE INDEX "_news_v_version_tags_parent_idx" ON "_news_v_version_tags" USING btree ("parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_cover_image_idx" ON "_news_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_media_id_idx" ON "_news_v_rels" USING btree ("media_id");
  CREATE INDEX "achievements_tags_order_idx" ON "achievements_tags" USING btree ("order");
  CREATE INDEX "achievements_tags_parent_idx" ON "achievements_tags" USING btree ("parent_id");
  CREATE INDEX "achievements_videos_order_idx" ON "achievements_videos" USING btree ("_order");
  CREATE INDEX "achievements_videos_parent_id_idx" ON "achievements_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "achievements_slug_idx" ON "achievements" USING btree ("slug");
  CREATE INDEX "achievements_cover_image_idx" ON "achievements" USING btree ("cover_image_id");
  CREATE INDEX "achievements_updated_at_idx" ON "achievements" USING btree ("updated_at");
  CREATE INDEX "achievements_created_at_idx" ON "achievements" USING btree ("created_at");
  CREATE INDEX "achievements__status_idx" ON "achievements" USING btree ("_status");
  CREATE UNIQUE INDEX "achievements_locales_locale_parent_id_unique" ON "achievements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "achievements_rels_order_idx" ON "achievements_rels" USING btree ("order");
  CREATE INDEX "achievements_rels_parent_idx" ON "achievements_rels" USING btree ("parent_id");
  CREATE INDEX "achievements_rels_path_idx" ON "achievements_rels" USING btree ("path");
  CREATE INDEX "achievements_rels_media_id_idx" ON "achievements_rels" USING btree ("media_id");
  CREATE INDEX "_achievements_v_version_tags_order_idx" ON "_achievements_v_version_tags" USING btree ("order");
  CREATE INDEX "_achievements_v_version_tags_parent_idx" ON "_achievements_v_version_tags" USING btree ("parent_id");
  CREATE INDEX "_achievements_v_version_videos_order_idx" ON "_achievements_v_version_videos" USING btree ("_order");
  CREATE INDEX "_achievements_v_version_videos_parent_id_idx" ON "_achievements_v_version_videos" USING btree ("_parent_id");
  CREATE INDEX "_achievements_v_parent_idx" ON "_achievements_v" USING btree ("parent_id");
  CREATE INDEX "_achievements_v_version_version_slug_idx" ON "_achievements_v" USING btree ("version_slug");
  CREATE INDEX "_achievements_v_version_version_cover_image_idx" ON "_achievements_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_achievements_v_version_version_updated_at_idx" ON "_achievements_v" USING btree ("version_updated_at");
  CREATE INDEX "_achievements_v_version_version_created_at_idx" ON "_achievements_v" USING btree ("version_created_at");
  CREATE INDEX "_achievements_v_version_version__status_idx" ON "_achievements_v" USING btree ("version__status");
  CREATE INDEX "_achievements_v_created_at_idx" ON "_achievements_v" USING btree ("created_at");
  CREATE INDEX "_achievements_v_updated_at_idx" ON "_achievements_v" USING btree ("updated_at");
  CREATE INDEX "_achievements_v_snapshot_idx" ON "_achievements_v" USING btree ("snapshot");
  CREATE INDEX "_achievements_v_published_locale_idx" ON "_achievements_v" USING btree ("published_locale");
  CREATE INDEX "_achievements_v_latest_idx" ON "_achievements_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_achievements_v_locales_locale_parent_id_unique" ON "_achievements_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_achievements_v_rels_order_idx" ON "_achievements_v_rels" USING btree ("order");
  CREATE INDEX "_achievements_v_rels_parent_idx" ON "_achievements_v_rels" USING btree ("parent_id");
  CREATE INDEX "_achievements_v_rels_path_idx" ON "_achievements_v_rels" USING btree ("path");
  CREATE INDEX "_achievements_v_rels_media_id_idx" ON "_achievements_v_rels" USING btree ("media_id");
  CREATE INDEX "staff_sections_order_idx" ON "staff_sections" USING btree ("_order");
  CREATE INDEX "staff_sections_parent_id_idx" ON "staff_sections" USING btree ("_parent_id");
  CREATE INDEX "staff_sections_locale_idx" ON "staff_sections" USING btree ("_locale");
  CREATE UNIQUE INDEX "staff_slug_idx" ON "staff" USING btree ("slug");
  CREATE INDEX "staff_photo_idx" ON "staff" USING btree ("photo_id");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  CREATE INDEX "staff__status_idx" ON "staff" USING btree ("_status");
  CREATE UNIQUE INDEX "staff_locales_locale_parent_id_unique" ON "staff_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_staff_v_version_sections_order_idx" ON "_staff_v_version_sections" USING btree ("_order");
  CREATE INDEX "_staff_v_version_sections_parent_id_idx" ON "_staff_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_staff_v_version_sections_locale_idx" ON "_staff_v_version_sections" USING btree ("_locale");
  CREATE INDEX "_staff_v_parent_idx" ON "_staff_v" USING btree ("parent_id");
  CREATE INDEX "_staff_v_version_version_slug_idx" ON "_staff_v" USING btree ("version_slug");
  CREATE INDEX "_staff_v_version_version_photo_idx" ON "_staff_v" USING btree ("version_photo_id");
  CREATE INDEX "_staff_v_version_version_updated_at_idx" ON "_staff_v" USING btree ("version_updated_at");
  CREATE INDEX "_staff_v_version_version_created_at_idx" ON "_staff_v" USING btree ("version_created_at");
  CREATE INDEX "_staff_v_version_version__status_idx" ON "_staff_v" USING btree ("version__status");
  CREATE INDEX "_staff_v_created_at_idx" ON "_staff_v" USING btree ("created_at");
  CREATE INDEX "_staff_v_updated_at_idx" ON "_staff_v" USING btree ("updated_at");
  CREATE INDEX "_staff_v_snapshot_idx" ON "_staff_v" USING btree ("snapshot");
  CREATE INDEX "_staff_v_published_locale_idx" ON "_staff_v" USING btree ("published_locale");
  CREATE INDEX "_staff_v_latest_idx" ON "_staff_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_staff_v_locales_locale_parent_id_unique" ON "_staff_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "laboratories_research_areas_order_idx" ON "laboratories_research_areas" USING btree ("_order");
  CREATE INDEX "laboratories_research_areas_parent_id_idx" ON "laboratories_research_areas" USING btree ("_parent_id");
  CREATE INDEX "laboratories_research_areas_locale_idx" ON "laboratories_research_areas" USING btree ("_locale");
  CREATE UNIQUE INDEX "laboratories_slug_idx" ON "laboratories" USING btree ("slug");
  CREATE INDEX "laboratories_updated_at_idx" ON "laboratories" USING btree ("updated_at");
  CREATE INDEX "laboratories_created_at_idx" ON "laboratories" USING btree ("created_at");
  CREATE UNIQUE INDEX "laboratories_locales_locale_parent_id_unique" ON "laboratories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "laboratories_rels_order_idx" ON "laboratories_rels" USING btree ("order");
  CREATE INDEX "laboratories_rels_parent_idx" ON "laboratories_rels" USING btree ("parent_id");
  CREATE INDEX "laboratories_rels_path_idx" ON "laboratories_rels" USING btree ("path");
  CREATE INDEX "laboratories_rels_staff_id_idx" ON "laboratories_rels" USING btree ("staff_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "conferences_slug_idx" ON "conferences" USING btree ("slug");
  CREATE INDEX "conferences_updated_at_idx" ON "conferences" USING btree ("updated_at");
  CREATE INDEX "conferences_created_at_idx" ON "conferences" USING btree ("created_at");
  CREATE UNIQUE INDEX "conferences_locales_locale_parent_id_unique" ON "conferences_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "ethics_opinions_slug_idx" ON "ethics_opinions" USING btree ("slug");
  CREATE INDEX "ethics_opinions_updated_at_idx" ON "ethics_opinions" USING btree ("updated_at");
  CREATE INDEX "ethics_opinions_created_at_idx" ON "ethics_opinions" USING btree ("created_at");
  CREATE UNIQUE INDEX "ethics_opinions_locales_locale_parent_id_unique" ON "ethics_opinions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "study_programmes_slug_idx" ON "study_programmes" USING btree ("slug");
  CREATE INDEX "study_programmes_updated_at_idx" ON "study_programmes" USING btree ("updated_at");
  CREATE INDEX "study_programmes_created_at_idx" ON "study_programmes" USING btree ("created_at");
  CREATE UNIQUE INDEX "study_programmes_locales_locale_parent_id_unique" ON "study_programmes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "student_projects_slug_idx" ON "student_projects" USING btree ("slug");
  CREATE INDEX "student_projects_updated_at_idx" ON "student_projects" USING btree ("updated_at");
  CREATE INDEX "student_projects_created_at_idx" ON "student_projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "student_projects_locales_locale_parent_id_unique" ON "student_projects_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "interest_groups_slug_idx" ON "interest_groups" USING btree ("slug");
  CREATE INDEX "interest_groups_updated_at_idx" ON "interest_groups" USING btree ("updated_at");
  CREATE INDEX "interest_groups_created_at_idx" ON "interest_groups" USING btree ("created_at");
  CREATE UNIQUE INDEX "interest_groups_locales_locale_parent_id_unique" ON "interest_groups_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "industry_partners_slug_idx" ON "industry_partners" USING btree ("slug");
  CREATE INDEX "industry_partners_logo_idx" ON "industry_partners" USING btree ("logo_id");
  CREATE INDEX "industry_partners_updated_at_idx" ON "industry_partners" USING btree ("updated_at");
  CREATE INDEX "industry_partners_created_at_idx" ON "industry_partners" USING btree ("created_at");
  CREATE UNIQUE INDEX "industry_partners_locales_locale_parent_id_unique" ON "industry_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hero_slides_image_idx" ON "hero_slides" USING btree ("image_id");
  CREATE INDEX "hero_slides_updated_at_idx" ON "hero_slides" USING btree ("updated_at");
  CREATE INDEX "hero_slides_created_at_idx" ON "hero_slides" USING btree ("created_at");
  CREATE UNIQUE INDEX "hero_slides_locales_locale_parent_id_unique" ON "hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_achievements_id_idx" ON "payload_locked_documents_rels" USING btree ("achievements_id");
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX "payload_locked_documents_rels_laboratories_id_idx" ON "payload_locked_documents_rels" USING btree ("laboratories_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_conferences_id_idx" ON "payload_locked_documents_rels" USING btree ("conferences_id");
  CREATE INDEX "payload_locked_documents_rels_ethics_opinions_id_idx" ON "payload_locked_documents_rels" USING btree ("ethics_opinions_id");
  CREATE INDEX "payload_locked_documents_rels_study_programmes_id_idx" ON "payload_locked_documents_rels" USING btree ("study_programmes_id");
  CREATE INDEX "payload_locked_documents_rels_student_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("student_projects_id");
  CREATE INDEX "payload_locked_documents_rels_interest_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("interest_groups_id");
  CREATE INDEX "payload_locked_documents_rels_industry_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("industry_partners_id");
  CREATE INDEX "payload_locked_documents_rels_hero_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_slides_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "research_group_locales_locale_parent_id_unique" ON "research_group_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "highlighted_rels_order_idx" ON "highlighted_rels" USING btree ("order");
  CREATE INDEX "highlighted_rels_parent_idx" ON "highlighted_rels" USING btree ("parent_id");
  CREATE INDEX "highlighted_rels_path_idx" ON "highlighted_rels" USING btree ("path");
  CREATE INDEX "highlighted_rels_news_id_idx" ON "highlighted_rels" USING btree ("news_id");
  CREATE INDEX "highlighted_rels_achievements_id_idx" ON "highlighted_rels" USING btree ("achievements_id");
  CREATE INDEX "highlighted_rels_projects_id_idx" ON "highlighted_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "news_tags" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v_version_tags" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "achievements_tags" CASCADE;
  DROP TABLE "achievements_videos" CASCADE;
  DROP TABLE "achievements" CASCADE;
  DROP TABLE "achievements_locales" CASCADE;
  DROP TABLE "achievements_rels" CASCADE;
  DROP TABLE "_achievements_v_version_tags" CASCADE;
  DROP TABLE "_achievements_v_version_videos" CASCADE;
  DROP TABLE "_achievements_v" CASCADE;
  DROP TABLE "_achievements_v_locales" CASCADE;
  DROP TABLE "_achievements_v_rels" CASCADE;
  DROP TABLE "staff_sections" CASCADE;
  DROP TABLE "staff" CASCADE;
  DROP TABLE "staff_locales" CASCADE;
  DROP TABLE "_staff_v_version_sections" CASCADE;
  DROP TABLE "_staff_v" CASCADE;
  DROP TABLE "_staff_v_locales" CASCADE;
  DROP TABLE "laboratories_research_areas" CASCADE;
  DROP TABLE "laboratories" CASCADE;
  DROP TABLE "laboratories_locales" CASCADE;
  DROP TABLE "laboratories_rels" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "conferences" CASCADE;
  DROP TABLE "conferences_locales" CASCADE;
  DROP TABLE "ethics_opinions" CASCADE;
  DROP TABLE "ethics_opinions_locales" CASCADE;
  DROP TABLE "study_programmes" CASCADE;
  DROP TABLE "study_programmes_locales" CASCADE;
  DROP TABLE "student_projects" CASCADE;
  DROP TABLE "student_projects_locales" CASCADE;
  DROP TABLE "interest_groups" CASCADE;
  DROP TABLE "interest_groups_locales" CASCADE;
  DROP TABLE "industry_partners" CASCADE;
  DROP TABLE "industry_partners_locales" CASCADE;
  DROP TABLE "hero_slides" CASCADE;
  DROP TABLE "hero_slides_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP TABLE "research_group" CASCADE;
  DROP TABLE "research_group_locales" CASCADE;
  DROP TABLE "highlighted" CASCADE;
  DROP TABLE "highlighted_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_news_tags";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_tags";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_achievements_tags";
  DROP TYPE "public"."enum_achievements_status";
  DROP TYPE "public"."enum__achievements_v_version_tags";
  DROP TYPE "public"."enum__achievements_v_version_status";
  DROP TYPE "public"."enum__achievements_v_published_locale";
  DROP TYPE "public"."enum_staff_section";
  DROP TYPE "public"."enum_staff_status";
  DROP TYPE "public"."enum__staff_v_version_section";
  DROP TYPE "public"."enum__staff_v_version_status";
  DROP TYPE "public"."enum__staff_v_published_locale";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_study_programmes_type";
  DROP TYPE "public"."enum_users_role";`)
}

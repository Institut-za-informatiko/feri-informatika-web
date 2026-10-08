import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Better Auth passkey table (src/lib/auth/server.ts, generated with better-auth/db/migration).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  create table "ba_passkey" ("id" text not null primary key, "name" text, "publicKey" text not null, "userId" text not null references "ba_user" ("id") on delete cascade, "credentialID" text not null, "counter" integer not null, "deviceType" text not null, "backedUp" boolean not null, "transports" text, "createdAt" timestamptz, "aaguid" text);
  create index "ba_passkey_userId_idx" on "ba_passkey" ("userId");
  create index "ba_passkey_credentialID_idx" on "ba_passkey" ("credentialID");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "ba_passkey";`)
}

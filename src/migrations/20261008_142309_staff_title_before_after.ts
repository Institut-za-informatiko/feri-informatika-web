import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Splits the old single "title" into the parts before and after the name, e.g.
 * "doc. dr. Tina Beranič, mag. inž. inf. in tehnol. kom." → "doc. dr." | "mag. inž. inf. in tehnol. kom."
 */
const RANKS = new Set(['red.', 'izr.', 'prof.', 'doc.', 'dr.', 'asist.'])
const WORDS: Record<string, string> = { docent: 'doc.', 'izredni profesor': 'izr. prof.', 'redni profesor': 'red. prof.' }

export function splitTitle(raw: string | null, name: string): { before: string | null; after: string | null } {
  if (!raw?.trim()) return { before: null, after: null }
  let rest = raw.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), ' ').replace(/\s+/g, ' ').trim()
  const whole = WORDS[rest.toLowerCase()]
  if (whole) return { before: whole, after: null }
  const before: string[] = []
  const tokens = rest.split(' ')
  let used = 0
  for (const token of tokens) {
    const core = token.replace(/,$/, '').toLowerCase()
    if (!RANKS.has(core)) break
    before.push(core)
    used++
    if (token.endsWith(',')) break // the comma ends the part before the name
  }
  rest = tokens.slice(used).join(' ')
  // "dr. računalništva in informatike" names the doctorate itself; "dr." before the name says it.
  if (before.includes('dr.') && /^računalništva in informatike\b/i.test(rest)) rest = rest.replace(/^računalništva in informatike/i, '')
  rest = rest.replace(/(\s*,)+/g, ',').replace(/^[\s,]+|[\s,]+$/g, '').trim()
  return { before: before.length ? before.join(' ') : null, after: rest || null }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "staff" ADD COLUMN "title_before" varchar;
  ALTER TABLE "staff" ADD COLUMN "title_after" varchar;
  ALTER TABLE "_staff_v" ADD COLUMN "version_title_before" varchar;
  ALTER TABLE "_staff_v" ADD COLUMN "version_title_after" varchar;`)

  // Titles were localized but only ever filled in Slovenian; the new fields are shared.
  const docs = await db.execute(sql`
    SELECT s.id, s.name, l.title FROM "staff" s
    JOIN "staff_locales" l ON l._parent_id = s.id AND l._locale = 'sl'`)
  for (const row of docs.rows as { id: number; name: string; title: string | null }[]) {
    const { before, after } = splitTitle(row.title, row.name)
    await db.execute(sql`UPDATE "staff" SET "title_before" = ${before}, "title_after" = ${after} WHERE id = ${row.id}`)
  }
  const versions = await db.execute(sql`
    SELECT v.id, v.version_name AS name, l.version_title AS title FROM "_staff_v" v
    JOIN "_staff_v_locales" l ON l._parent_id = v.id AND l._locale = 'sl'`)
  for (const row of versions.rows as { id: number; name: string | null; title: string | null }[]) {
    const { before, after } = splitTitle(row.title, row.name ?? '')
    await db.execute(sql`UPDATE "_staff_v" SET "version_title_before" = ${before}, "version_title_after" = ${after} WHERE id = ${row.id}`)
  }

  await db.execute(sql`
  ALTER TABLE "staff_locales" DROP COLUMN "title";
  ALTER TABLE "_staff_v_locales" DROP COLUMN "version_title";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "staff_locales" ADD COLUMN "title" varchar;
  ALTER TABLE "_staff_v_locales" ADD COLUMN "version_title" varchar;
  ALTER TABLE "staff" DROP COLUMN "title_before";
  ALTER TABLE "staff" DROP COLUMN "title_after";
  ALTER TABLE "_staff_v" DROP COLUMN "version_title_before";
  ALTER TABLE "_staff_v" DROP COLUMN "version_title_after";`)
}

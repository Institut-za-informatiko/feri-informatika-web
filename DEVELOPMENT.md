# Development

## Requirements

- Node.js ≥ 22.12 and pnpm (`corepack enable`)
- Docker (for a local Postgres)
- Optional, for secrets: `sops`, `age`, `just` (`brew install sops age just`)

## Setup

```bash
git clone https://github.com/Institut-za-informatiko/feri-informatika-web.git
cd feri-informatika-web
corepack enable
pnpm install

docker run -d --name fiw-db -p 127.0.0.1:5432:5432 \
  -e POSTGRES_USER=payload -e POSTGRES_PASSWORD=payload -e POSTGRES_DB=payload postgres:17-alpine
cp .env.example .env.local
pnpm payload migrate
pnpm dev
```

Site: http://localhost:3000 · CMS: http://localhost:3000/admin.

Add yourself with `ADMIN_EMAIL=you@example.com pnpm create:admin`, then sign in at `/admin`.
With `RESEND_API_KEY` empty the sign-in link is printed to the dev server log instead of emailed.

For realistic content, restore a production dump (see [DEPLOYMENT.md](DEPLOYMENT.md#backups))
into the local database and copy the media files into `media/`.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` / `pnpm start` | Production build / server |
| `pnpm lint` / `pnpm lint:ci` | Biome check with / without fixes |
| `pnpm typecheck` | TypeScript |
| `pnpm payload migrate:create <name>` | New migration after a schema change |
| `pnpm payload migrate` | Apply pending migrations |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Regenerate the admin import map after adding admin components |
| `pnpm create:admin` | Add or re-activate an administrator (`ADMIN_EMAIL`, optional `ADMIN_NAME`) |

## Architecture

### Routing and languages

- `src/app/(frontend)/[locale]/…` serves both languages (`sl`, `en`).
- `src/proxy.ts` rewrites un-prefixed URLs to the `sl` locale, so Slovenian stays at `/news/x`
  and English at `/en/news/x`. `/sl/…` redirects to the un-prefixed URL.
- Old URLs are kept with redirects in `next.config.ts`.

### Data

`src/lib/payload.ts` reads content through the Payload Local API from server components:

```tsx
const news = await findAll('news', lang, { sort: '-date' });
const article = await findBySlug('news', slug, lang); // 404s if missing
const about = await findGlobal('about', lang);
```

Reads use the visitor's locale with Slovenian fallback. Outside draft mode only published
documents are returned; in draft mode (preview) editors see drafts.

### Caching

Pages have `generateStaticParams` returning `[]`: each page renders on its first request and
is cached until content changes. `src/hooks/revalidate.ts` purges the cache on every
publish, unpublish or delete, so new content shows up on the next request. The Docker build
needs no database.

### Sign-in

- Passwordless via Better Auth (`src/lib/auth/server.ts`, mounted at `/api/auth/*`) with
  the magic-link plugin; emails go out through Resend (`src/lib/auth/email.ts`).
- Who may sign in is the Payload `users` collection: a link is sent only to an active user,
  and `src/lib/auth/strategy.ts` (a Payload auth strategy) maps the Better Auth session to
  that user on every request. Roles and permissions stay in Payload.
- Passkeys (`@better-auth/passkey`) are registered from the user's own account page
  (`PasskeyManager`) and offered by the browser on the login page (conditional mediation).
  The WebAuthn relying party is the host of `SERVER_URL`; the client never sends a passkey
  `name`, because the plugin would store it as the WebAuthn user name instead of the email.
- Better Auth's tables (`ba_*`) are created by Payload migrations like everything else.

### Preview

- `admin.livePreview` (in `src/payload.config.ts`) and each collection's Preview button point
  to `/next/preview?path=…&secret=…` (`src/lib/preview.ts`).
- That route checks the CMS login and `PREVIEW_SECRET`, enables Next draft mode and redirects
  to the page.
- `RefreshOnSave` re-renders the page while the editor types.

### UI

- shadcn/ui components live in `src/components/ui` (added with `pnpm dlx shadcn@latest add …`).
- Theme tokens (UM blue, accent yellow, fonts) are in `src/app/(frontend)/globals.css`.
- Shared building blocks: `PageShell`, `PageHeader`, `Prose` (`src/components/PageShell.tsx`),
  and `CardGrid`, `ImageCard`, `Section`, `Gallery`, `TagFilteredGrid` (`src/components/cards.tsx`).
- Client components (interactivity only) are in `src/components/client`.

### Add a page

1. Create `src/app/(frontend)/[locale]/<path>/page.tsx` with `params: Promise<{ locale: Lang }>`.
2. Fetch with `findAll` / `findBySlug` / `findGlobal`, render inside `PageShell`.
3. Put every UI string in `src/i18n/translations.ts` (both languages).
4. Free-standing text pages need no code: create them in the CMS under **Strani**, with the
   path as slug, and add a route that renders them with `CmsPage`.

### Add a content type

1. Add a `CollectionConfig` in `src/collections/` (use `slugField`, `bodyField`, `revalidateHooks`).
2. `pnpm payload migrate:create <name>` and `pnpm generate:types`; commit `src/migrations/*`.
3. If it has public pages, add its path to `src/lib/preview.ts`.

## Secrets (sops + age)

`.env.enc` is committed; `.env` and `.env.local` are gitignored. Recipients are in `.sops.yaml`;
your private age key stays at the sops default path
(macOS: `~/Library/Application Support/sops/age/keys.txt`).

```bash
just decrypt    # .env.enc -> .env
just encrypt    # .env -> .env.enc
just edit-env   # edit .env.enc in place
```

## Resources

- [Next.js docs](https://nextjs.org/docs)
- [Payload docs](https://payloadcms.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)

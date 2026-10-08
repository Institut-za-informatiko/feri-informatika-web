# Development Guide — Technical Documentation

## Repository Rules

Automated coding agents must follow `AGENTS.md` in the repository root. The most important rule for this site is accessibility: DOM order must match visual and reading order, and semantic markup should not be replaced with CSS-only visual reordering.

##  Setup

### Requirements

- **Node.js** ≥ 22.12.0
- **pnpm** (enable via `corepack enable`)
- **Git** (for version control)
- **VS Code** (recommended) with Astro + Biome extensions
- _Optional (secrets):_ `sops`, `age`, `just` — `brew install sops age just`

### Installation

```bash
# Clone the repository
git clone https://github.com/Institut-za-informatiko/feri-informatika-web.git
cd feri-informatika-web

# Enable pnpm (once)
corepack enable

# Install dependencies
pnpm install

# Start the CMS (Postgres in Docker + Payload on :3000)
docker run -d --name fiw-cms-db -p 127.0.0.1:5432:5432 \
  -e POSTGRES_USER=payload -e POSTGRES_PASSWORD=payload -e POSTGRES_DB=payload postgres:17-alpine
cp cms/.env.example cms/.env
pnpm --filter cms payload migrate
pnpm --filter cms dev

# Start the site against it (in another terminal)
CMS_URL=http://localhost:3000 pnpm dev
```

Site: **http://localhost:4321** · CMS: **http://localhost:3000/admin**

The site has no content of its own: every page is built from the CMS REST API.
To work on a realistic dataset, restore a dump from the server (see
[DEPLOYMENT.md](DEPLOYMENT.md#backups)).

### Lint & format

Biome handles linting and formatting (JS/TS/JSON; `.astro` files are left to
the Astro tooling).

```bash
pnpm lint       # check + auto-fix + organize imports
pnpm format     # format only
pnpm lint:ci    # check without writing (used in CI)
```

### Secrets (sops + age)

`.env` holds the production CMS secrets (`PAYLOAD_SECRET`, `POSTGRES_PASSWORD`,
`GITHUB_DISPATCH_TOKEN`, the first admin login). The site build itself needs only
`CMS_URL`.

Encrypted `.env.enc` is committed; the plaintext `.env` is gitignored. Recipients
are configured in `.sops.yaml`. Your **private** age key lives outside the repo at
the sops default path (macOS: `~/Library/Application Support/sops/age/keys.txt`).

```bash
just decrypt    # .env.enc -> .env
just encrypt    # .env -> .env.enc
just edit-env   # edit .env.enc in place
```

##  Architecture

### Static Site Generation (SSG)

This is an **Astro SSG** project all content is compiled into static HTML files **at build time**, not during visits.

### Dual Language Structure (Slovenian/English)

```
src/pages/
├── index.astro                    ← SL (/)
├── about.astro
├── research/
│   └── group.astro
└── en/
    ├── index.astro                ← EN (/en/)
    ├── about.astro
    └── research/
        └── group.astro
```

**Rule:** Every Slovenian page must have an English equivalent in the `en/` folder. I18n is handled automatically by `astro.config.mjs`.

##  Common Changes

### 1. Add a New Page

**For Slovenian:**
```astro
src/pages/nova-stran.astro
---
import Base from "../layouts/Base.astro";
const lang = "sl";
---
<Base lang={lang} title="Naslov strani">
  <h1>Vsebina</h1>
</Base>
```

**For English (required):**
```astro
src/pages/en/nova-stran.astro
---
import Base from "../../layouts/Base.astro";
const lang = "en";
---
<Base lang={lang} title="Page Title">
  <h1>Content</h1>
</Base>
```

### 2. Add a New Content Collection

1. Define it in the CMS: add a `CollectionConfig` to `cms/src/collections/content.ts`
   and list it in `contentCollections`. Use `slugField`, `bodyFields` and
   `rebuildHooks` like the existing ones.
2. Generate the schema migration and types:
   ```bash
   pnpm --filter cms payload migrate:create my_collection
   pnpm --filter cms generate:types
   ```
   Commit the files in `cms/src/migrations/`; they run automatically when the CMS
   container starts.
3. Expose it to Astro in `src/content.config.ts` with `localized('<slug>', schema, map)`,
   which defines `<name>` (Slovenian) and `<name>En`. Add both to `collections`.

### 3. Change Styles (CSS)

Global styles:
```
public/styles/global.css
```

Colors and CSS variables:
```css
:root {
  --um-blue: #003366;
  --accent: #FFD700;
  /* ... */
}
```

Components have local styles in `<style>` blocks within `.astro` files.

### 4. Edit a Component

Components are in `src/components/`:
```
NewsCard.astro       ← Individual news cards
SectionNews.astro    ← News section with filtering
```

Edit `NewsCard.astro` and it automatically affects all news listing pages.

##  I18n (Bilingual Support)

### How it Works

1. **astro.config.mjs** defines locales:
```javascript
i18n: {
  defaultLocale: "sl",
  locales: ["sl", "en"],
  routing: {
    prefixDefaultLocale: false,  // SL is /feri.../
  },
}
```

2. **Automatic routing:**
   - `/foo` → `src/pages/foo.astro` (SL)
   - `/en/foo` → `src/pages/en/foo.astro` (EN)

3. **UI Translations** (`src/i18n/translations.ts`):
```typescript
export const translations = {
  sl: {
    "nav.home": "Domov",
    "nav.about": "O nas",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
  },
};
```

4. **Usage:**
```astro
import { useTranslations } from "../i18n/utils";
const t = useTranslations(lang);
<h1>{t("nav.home")}</h1>
```

### Add a New Translation

1. Open `src/i18n/translations.ts`
2. Add key in both languages:
```typescript
"footer.contact": "Kontakt",  // SL
"footer.contact": "Contact",  // EN
```
3. Use: `{t("footer.contact")}`

##  Content Collections

All content lives in the **Payload CMS** (`cms/`, Postgres). At build time
`src/content.config.ts` loads it through `src/lib/cms.ts`:

- every collection exists as `<name>` (Slovenian) and `<name>En` (English, falling back
  to Slovenian per field);
- entry ids are the CMS `slug`, so URLs are stable;
- rich text arrives as HTML (`render(entry)` → `<Content />` works as before);
- images are objects `{ src, srcset, width, height, alt }`; render them with
  `src/components/CmsImage.astro` (resized variants are made by the CMS on upload);
- singletons: `getEntry("about", "institute")`, `getEntry("research", "group")`,
  `getEntry("highlighted", "config")`.

### How to Read Content in .astro Files

```astro
---
import { getCollection } from "astro:content";

// Use "newsEn" on pages under src/pages/en/
const allNews = await getCollection("news");
const newsByTag = allNews.filter(n => n.data.tags.includes("student"));
---
```

### Schemas

The source of truth is the CMS config in `cms/src/collections/` and `cms/src/globals/`.
The zod schemas in `src/content.config.ts` describe what the site reads from it.

##  Resources

- [Astro Documentation](https://docs.astro.build)
- [Payload CMS](https://payloadcms.com/docs)

##  For Content Editors

Editors who only work with the CMS don't need this guide. See `CMS_GUIDE.md`.

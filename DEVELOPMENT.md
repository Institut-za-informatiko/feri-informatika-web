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

# Start local development server
pnpm dev
```

Access: **http://localhost:4321/feri-informatika-web**

### Lint & format

Biome handles linting and formatting (JS/TS/JSON; `.astro` files are left to
the Astro tooling).

```bash
pnpm lint       # check + auto-fix + organize imports
pnpm format     # format only
pnpm lint:ci    # check without writing (used in CI)
```

### Secrets (sops + age)

The repo currently needs **no environment variables** to build or run — the
tooling below is scaffolded for when a secret is first introduced.

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

In `astro.config.mjs`, add a new block to the `collections:` array:

```javascript
{
  name: "myCollection",
  label: "My Collection",
  folder: "src/content/my-collection",
  create: true,
  slug: "{{slug}}",
  fields: [
    { name: "title", label: "Title", widget: "string" },
    { name: "body", label: "Content", widget: "markdown" },
  ],
}
```

Then in `src/content/config.ts` (create if it doesn't exist):
```typescript
import { defineCollection, z } from "astro:content";
import { sveltiaLoader } from "astro-loader-sveltia-cms";

const myCollection = defineCollection({
  loader: sveltiaLoader("myCollection"),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { myCollection };
```

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

All content is in `src/content/`:

```
src/content/
├── news/              ← News (48+ entries)
├── achievements/      ← Achievements (48+ entries)
├── staff/             ← Staff members (15+ entries)
├── projects/          ← Research projects
├── laboratories/      ← Labs
└── config/
    └── highlighted.json  ← Featured items
```

### How to Read Content in .astro Files

```astro
---
import { getCollection } from "astro:content";

const allNews = await getCollection("news");
const newsByTag = allNews.filter(n => n.data.tags.includes("student"));
---

{allNews.map(article => (
  <article>
    <h2>{article.data.title}</h2>
    <p>{article.data.summary}</p>
  </article>
))}
```

### Schemas (Data Structures)

Schemas are in `astro.config.mjs` (Sveltia integration).

**Example — News:**
```javascript
{
  name: "news",
  fields: [
    { name: "title", label: "Title", widget: "string" },
    { name: "date", label: "Date", widget: "datetime" },
    { name: "tags", label: "Tags", widget: "select", multiple: true, ... },
    { name: "summary", label: "Summary", widget: "text" },
    { name: "coverImage", label: "Cover Image", widget: "image", required: false },
    { name: "body", label: "Full Content", widget: "markdown" },
  ],
}
```

Change schemas by editing `astro.config.mjs` and the CMS automatically adapts.

##  Resources

- [Astro Documentation](https://docs.astro.build)
- [Sveltia CMS](https://github.com/sveltia/cms)
- [GitHub Pages](https://pages.github.com/)

##  For Content Editors

Editors who only work with the CMS don't need this guide. See `CMS_GUIDE.md`.

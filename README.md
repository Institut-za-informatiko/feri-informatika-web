# Institute of Informatics

A professional website for the Institute of Informatics (FERI, University of Maribor), built as a static site with Astro and managed through Sveltia CMS.

##  What is this?

A professional institutional website with full bilingual support (Slovenian + English) and content management through a graphical interface, no coding required.

**Live website:** https://ii-preview.bclabum.si
**CMS (editing):** `/admin` (Payload CMS, accounts managed by admins)

##  What's on the website?

-  **Institute** — Overview, laboratories, interest groups, staff members
-  **Studies** — Study programs, student projects
-  **Research** — Research projects, publications, ethics committee
-  **Research groups** — Research areas, SICRIS
-  **Achievements** — Awards, conferences, special recognition 
-  **News** — Updated articles with images and text 
-  **Partners** — Industry partners, conferences
-  **Conferences** — Upcoming events,  past conferences archive
-  **Featured** — Interactive carousel on homepage

##  Quick Start

### For Editors

1. Go to **https://ii-preview.bclabum.si/admin**
2. Log in with the email and password an administrator created for you
3. Select a collection (e.g., "Novice", "Dosežki", "Osebje")
4. Add, edit or delete content

**Detailed guide:** See `CMS_GUIDE.md`

### For Development Teams

```bash
# Enable pnpm (once, via corepack)
corepack enable

# Install dependencies
pnpm install

# Local development server
pnpm dev
# Access: http://localhost:4321

# Production build
pnpm build

# Preview the build
pnpm preview
```

**Detailed guide:** See `DEVELOPMENT.md`

##  Project Structure

```
cms/                       ← Payload CMS (Next.js app, served at /admin and /api)
├── src/collections/       ← Content types (news, staff, achievements, …)
├── src/globals/           ← Singletons (about, research group, highlighted)
└── src/migrations/        ← Database schema migrations

src/
├── content.config.ts      ← Astro collections loaded from the CMS API
├── lib/cms.ts             ← CMS loader + image/HTML helpers
├── components/            ← Reusable Astro components (CmsImage, NewsCard, …)
├── i18n/                  ← Translations (SL + EN)
├── layouts/               ← Base templates
└── pages/                 ← Routing (auto from structure)
    ├── index.astro        ← Homepage
    ├── [other pages].astro
    └── en/                ← English variants

public/
├── assets/media/          ← Videos (not optimized images)
├── images/                ← Logos, icons
└── styles/                ← Global CSS variables
```

##  Bilingual Support

- **Slovenian** is default (`/`) — no prefix
- **English** is under `/en/`
- Auto fallback to Slovenian if English not available

##  How it Works

1. **Editor** publishes content in the CMS (`/admin`)
2. The CMS triggers a **GitHub Actions** rebuild (`repository_dispatch`, debounced 60 s)
3. **Astro** rebuilds the static HTML from the CMS API
4. The new image is deployed to bclabum (see [DEPLOYMENT.md](DEPLOYMENT.md)), live a few minutes after publishing

The public site is static HTML served by nginx; only `/admin` and `/api` reach the CMS.

##  Security

- Editing requires a CMS account (roles: administrator, editor); there is no public sign-up
- Drafts are never public; the site is built only from published content
- Only the rendered website is public
- Build happens automatically via GitHub Actions


##  Tech Stack

- **Astro 6.3.5** — Static site generator
- **Payload CMS** — Self-hosted headless CMS (Postgres), served at `/admin`
- **GitHub** — Hosting & authentication
- **Docker + nginx on bclabum** — Public deployment
- **Markdown** — Content format

##  Documentation

- **[CMS_GUIDE.md](./CMS_GUIDE.md)** — How to edit content in the CMS
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** — Technical guide for developers
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — How the project is built (architecture)

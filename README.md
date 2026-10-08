# Institute of Informatics

A professional website for the Institute of Informatics (FERI, University of Maribor), built as a static site with Astro and managed through Sveltia CMS.

##  What is this?

A professional institutional website with full bilingual support (Slovenian + English) and content management through a graphical interface, no coding required.

**Live website:** https://ii-preview.bclabum.si
**CMS (editing):** `/admin` (free access via Sveltia CMS)

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
2. Login with GitHub account (must be repo contributor)
3. Select a collection (e.g., "News", "Achievements", "Staff")
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
src/
├── assets/media/          ← Images, videos (managed via CMS)
├── components/            ← Reusable Astro components
│   ├── NewsCard.astro
│   └── SectionNews.astro
├── content/               ← All content (Markdown + JSON)
│   ├── achievements/      ← Achievements & activities
│   ├── news/              ← News articles
│   ├── staff/             ← Staff members
│   ├── laboratories/      ← Labs
│   ├── projects/          ← Research projects
│   └── ... (more collections)
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

1. **Editor** edits content in CMS (`/admin`)
2. **GitHub Actions** automatically submits changes (push)
3. **Astro** rebuilds static HTML files
4. A Docker image is built and deployed to bclabum (see [DEPLOYMENT.md](DEPLOYMENT.md))

No database or backend. The site is static HTML served by nginx.

##  Security

- Editing is protected with GitHub authentication
- Only the rendered website is public
- Build happens automatically via GitHub Actions


##  Tech Stack

- **Astro 6.3.5** — Static site generator
- **Sveltia CMS** — Headless CMS (no backend)
- **GitHub** — Hosting & authentication
- **Docker + nginx on bclabum** — Public deployment
- **Markdown** — Content format

##  Documentation

- **[CMS_GUIDE.md](./CMS_GUIDE.md)** — How to edit content in Sveltia CMS
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** — Technical guide for developers
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — How the project is built (architecture)

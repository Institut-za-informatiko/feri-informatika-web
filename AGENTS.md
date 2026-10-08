# Informatika Website Agent Rules

These rules apply to all automated edits in this repository.

## Stack

- One Next.js (App Router) app: the public site under `src/app/(frontend)/[locale]` and
  the Payload CMS (admin + REST API) under `src/app/(payload)`.
- Content is read with the Payload Local API (`src/lib/payload.ts`), never hardcoded.
- UI is built with shadcn/ui (base-ui primitives) and Tailwind CSS v4. Theme tokens live in
  `src/app/(frontend)/globals.css`.

## Accessibility

- Treat accessibility as a core requirement, not a follow-up polish step.
- Keep DOM order aligned with visual and reading order.
- Do not use CSS `order`, grid placement, or other visual-only reordering for meaningful content.
- Use semantic HTML before adding layout-only wrappers.
- Keep heading levels meaningful and hierarchical (one `h1` per page, from `PageHeader`).
- Use links for navigation and buttons for actions.
- Ensure interactive controls are keyboard accessible and have clear focus states.
- Preserve or add useful `alt` text for informative images; use empty `alt` only for decorative images.
- Do not hide visible text from assistive technology unless there is an accessible replacement.
- Dialogs and sheets always have a title (`sr-only` if it is not shown).

## Layout And Styling

- Mobile first: every page must work at 390px wide with no horizontal scrolling.
- Use existing shadcn components (`src/components/ui`) and the shared building blocks
  (`PageShell`, `Section`, `CardGrid`, `ImageCard`, …) before writing new markup.
- Use semantic tokens (`bg-primary`, `text-muted-foreground`, `bg-highlight`), never raw colours.
- Use `gap-*` for spacing, `size-*` for squares, `cn()` for conditional classes; no inline styles.
- Keep Open Sans as the body font and Titillium Web for headings (`font-heading`).
- Do not fix layout problems with DOM/CSS reordering when semantic markup should change instead.
- Check desktop and mobile behaviour for header, navigation, section menus, cards and grids after layout edits.

## Content And I18n

- One route tree serves both languages (`[locale]` = `sl` | `en`); Slovenian URLs have no prefix.
- Every UI string goes through `getTranslations(lang)` in `src/i18n/translations.ts`, with
  both `sl` and `en` entries.
- Editable text belongs in the CMS (localized fields), not in code.
- Preserve Slovenian characters and UTF-8 encoding.

## CMS Schema

- Schema changes need a migration: `pnpm payload migrate:create <name>` and commit
  `src/migrations/*`. Then run `pnpm generate:types`.
- Content changes purge the page cache through `src/hooks/revalidate.ts`; new collections
  must use `revalidateHooks`.

## Verification

- Run `pnpm lint:ci` and `pnpm typecheck`; run `pnpm build` for anything touching config or routing.
- Search for stale class names, duplicated helpers and one-off styles after edits.
- If a check fails for an environment or dependency reason, report that clearly.

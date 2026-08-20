# Informatika Website Agent Rules

These rules apply to all automated edits in this repository.

## Accessibility

- Treat accessibility as a core requirement, not a follow-up polish step.
- Keep DOM order aligned with visual and reading order.
- Do not use CSS `order`, grid placement, or other visual-only reordering for meaningful content.
- Use semantic HTML before adding layout-only wrappers.
- Keep heading levels meaningful and hierarchical.
- Use links for navigation and buttons for actions.
- Ensure interactive controls are keyboard accessible and have clear focus states.
- Preserve or add useful `alt` text for informative images; use empty `alt` only for decorative images.
- Do not hide visible text from assistive technology unless there is an accessible replacement.

## Layout And Styling

- Prefer existing site patterns in `public/styles/global.css`.
- Keep Open Sans as the default body font and Titillium Web for headings.
- Avoid inline styles for new work unless matching an existing local template pattern.
- Do not fix layout problems with DOM/CSS reordering when semantic markup should change instead.
- Check desktop and mobile behavior for header, navigation, sidebars, cards, and content grids after layout edits.

## Content And I18n

- Keep Slovenian and English pages structurally consistent when both versions exist.
- When changing visible section labels, check existing translations in `src/i18n/translations.ts` before hardcoding text.
- Preserve Slovenian characters and UTF-8 encoding.

## Verification

- After edits, search for stale class names, duplicated rules, and unintended one-off styles.
- Run the most relevant available check. If `pnpm build` fails for an environment or dependency reason, report that clearly.

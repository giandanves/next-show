# Install Tailwind and remove CSS Modules

## Summary
Introduce Tailwind CSS v4 as the only styling system, migrate existing surfaces off CSS Modules / styled-jsx, and define brand design tokens in `@theme`.

## Scope
- Install `tailwindcss`, `@tailwindcss/postcss`, `postcss`
- Add `postcss.config.mjs`
- Brand tokens in `src/app/styles/globals.css` (`@theme`):
  - colors: `primary`, `primary-light`, `secondary`, `secondary-light`, `white`
  - font: Cocogoose (`font-cocogoose`) via `/public/fonts/`
  - `max-h-hero` (844px)
  - `bg-primary-gradient`
- Replace Inter with Cocogoose on the root layout
- Delete CSS Modules: `Home.module.css`, `admin.module.css`, `ArtistProfile.module.css`, `ShowEvent.module.css`
- Migrate admin to shared Tailwind class strings (`src/app/(admin)/admin/ui.ts`)
- Migrate public artist/show pages, auth field components, and home chrome to Tailwind utilities

## Acceptance
- [ ] No `.module.css` imports remain in `src/`
- [ ] No `styled-jsx` in form field components
- [ ] Brand utilities work (`text-primary`, `bg-primary-gradient`, `max-h-hero`, `font-cocogoose`)
- [ ] Admin / public / home pages render with Tailwind only

## Out of scope
- Home Hero composition (separate draft task)
- Venue CRUD UI (tracked on `nsw-022`)

## Notes
Cocogoose webfont files must be placed under `public/fonts/` (`Cocogoose.woff2` / `.woff`) with a valid license. Without them the stack falls back to system UI.

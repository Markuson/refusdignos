# Epic 2 Context: Keystatic CMS for Colaboradores and Site Copy (Phase 2 - deferred)

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Epic 1 gave the client a working Keystatic admin panel scoped to the `refugios` collection only. This epic extends that same panel to the rest of the site's editable content: collaborator/sponsor entries, and the static copy on the homepage, contact, proyecto, únete, and legal pages. Today that copy is scattered and hardcoded across multiple component and page files (and in the case of contact/bank/social details, duplicated across three or more places), so any wording change requires a developer. This epic consolidates that content into Keystatic collections and singletons — mirroring the `globalSettings` singleton pattern already proven in the `ivocorr` project — so the client can keep the sponsors page, site-wide contact/bank/social details, and every static page's narrative and FAQ copy current without developer involvement. It builds directly on Epic 1's Keystatic installation, GitHub App auth, and `cloudinaryField` pattern rather than introducing new infrastructure.

## Stories

- Story 2.1: Manage Colaboradores via Keystatic
- Story 2.2: Manage Global Settings, Homepage, and Contact Page Copy via Keystatic
- Story 2.3: Manage Proyecto Page Copy via Keystatic
- Story 2.4: Manage Únete Page Copy via Keystatic
- Story 2.5: Manage Legal Page Copy via Keystatic

## Requirements & Constraints

- The client must be able to create, edit, and delete colaborador/sponsor entries, and edit static page copy (homepage, proyecto, únete, contacto, legal), through the same admin UI as Epic 1 — no developer involvement.
- No new backend, database, or hosting cost may be introduced; content continues to be read/written as markdown/data files already in the repo (no migration to a new data store).
- Content changes must go live through the existing Vercel build/deploy pipeline automatically — no manual deploy step.
- Adding/extending admin-managed content must not regress the public site's existing Lighthouse/accessibility standards.
- `pnpm build` must complete successfully after any create/edit/delete/reorder operation, with no schema validation errors.
- Repeatable/array content (benefits lists, FAQ items, impact stats, checklist items, etc.) must render however many items currently exist — never hardcoded to today's counts.
- Interactive functionality embedded in these pages (contact form fields/validation, membership form fields/validation, Web3Forms wiring) stays in code and is out of scope for CMS editing — only the surrounding copy is CMS-managed.
- Values already centralized elsewhere must not be duplicated: e.g. bank details shown on the únete page must keep reading from the `globalSettings` singleton (Story 2.2), not a second copy.

## Technical Decisions

- Extends Epic 1's installation as-is: same `@keystatic/astro` + `@astrojs/react` setup at `/keystatic`, same `github`-mode storage in production / `local` mode in dev, same GitHub App auth boundary (GitHub repo-collaborator permission gates saves; no allowlist field exists in self-hosted Keystatic).
- `colaboradores` becomes a Keystatic **collection** (like `refugios`), matching `src/content/colaboradores/*.md`, with fields nombre, tipo, descripcion, logo, url, orden.
- The `logo` field is a deliberate exception to Epic 1's "Cloudinary-only" approach: it must support **both** an external URL (existing pattern — legitimate, not something to migrate away from) and a new Cloudinary upload via the same `cloudinaryField` component used for refugios. This dual-support is intentional for colaboradores only.
- All remaining site copy is modeled as Keystatic **singletons** (one document per page/concern, not a collection) — the same `globalSettings` singleton pattern already used in the `ivocorr` project: `globalSettings`, `homePage`, `contactoPage`, `proyectoPage`, `unetePage`, and three legal singletons (`legalPrivacidad`, `legalTerminos`, `legalCookies`).
- `globalSettings` consolidates contact email, social links, and bank details that are today duplicated across `src/config/constants.ts`, `Footer.astro`, `BankDetails.astro`, and `contacto.astro` into one source of truth — after this story, none of those values should remain hardcoded in `constants.ts` or component files.
- Legal page singletons hold `lastUpdated` + a rich text/markdown `body` field per document (privacidad, términos, cookies) rather than granular fields, since these are long-form legal text.
- Structural/visual elements stay out of the CMS model: inline images (proyecto page's `nosotros1.webp`/`nosotros2.webp`), CTA button destinations, form field definitions/validation, and Web3Forms wiring are not singleton fields.
- Models are defined as additional collections/singletons on the same `src/content/config.ts` already used for `refugios`.

## Cross-Story Dependencies

- All of Epic 2 depends on Epic 1's completed Keystatic installation, GitHub App auth, and `cloudinaryField` component — this epic adds content models, not new infrastructure.
- Story 2.4 (únete page) depends on Story 2.2's `globalSettings` singleton: the bank details it displays via `BankDetails.astro` must read from `globalSettings`, not a duplicate field.
- Story 2.1 (colaboradores) reuses the `cloudinaryField` pattern from Epic 1 for the optional Cloudinary-hosted logo path.
- Story 2.5 (legal pages) carries a process note, not a technical dependency: because this is legally-reviewed content, client onboarding material for this story should recommend a second read before publishing (the "4 ojos" / four-eyes review principle already noted in project governance docs) — Keystatic itself does not enforce this.

# Epic 1 Context: Keystatic CMS for Refugios

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

The client currently cannot add or update refugio (mountain shelter) listings without developer involvement. This epic gives the client a protected, self-service admin panel at `/keystatic` for creating, editing, and deleting refugio entries — including uploading photos — with changes going live automatically through the existing Vercel deploy pipeline. It replaces an earlier plan to adopt Strapi (a separate hosted CMS + database) with Keystatic, a git-backed CMS that edits the same Astro Content Collections markdown files already in the repo. This keeps the site fully static, adds no backend/database/hosting cost, and requires no content migration. Colaboradores/sponsor management and static page copy editing are explicitly out of scope here (deferred to Epic 2).

## Stories

- Story 1.1: Protected Keystatic Admin Access
- Story 1.2: Manage Refugio Text Content via Keystatic
- Story 1.3: Migrate Refugio Images to Cloudinary and Enable Upload via Keystatic
- Story 1.4: Client Onboarding Guide for Adding Refugios

## Requirements & Constraints

- The client must be able to create, edit, and delete refugio entries entirely through a web admin UI, with no developer involvement.
- Image uploads must go directly from the browser to Cloudinary; raw image binaries must never be committed to the git repository — only Cloudinary's returned `public_id` is stored in content files.
- Admin access must be restricted to a specific, maintainable list of authorized accounts (not open to any authenticated user).
- Content changes must go live through the existing Vercel build/deploy pipeline automatically — no manual deploy step for the client.
- No new backend, database, or hosting cost may be introduced to support the CMS.
- No migration of existing non-image content: the CMS must read/write the same markdown files already in the repo, not a new data store.
- Adding the admin route must not regress the public site's existing Lighthouse/accessibility scores (Lighthouse ≥95 desktop / ≥90 mobile, WCAG AA) — admin-only dependencies (React, Keystatic) must not leak into the public site's JS bundle.
- Images must continue to be served via CDN with responsive transforms rather than as raw git-committed binaries.
- All refugio images existing at implementation time must be migrated to Cloudinary — treat the "18 images" figures in the source stories as stale; re-verify the actual current count in `src/content/refugios/` before migrating, since it has grown since these stories were drafted.
- After any content change (create/edit/delete/image migration), the Astro build must complete successfully with no schema validation errors or broken image references.

## Technical Decisions

- **CMS:** Keystatic (`@keystatic/astro` + `@astrojs/react`), mounted at `/keystatic` in `astro.config.mjs`. This is the same pattern already proven in the `ivocorr` project.
- **Storage mode:** `local` in development (reads/writes files directly on disk, no auth required); `github` in production (a GitHub App commits changes directly to the repo via the GitHub API).
- **Access control (corrected during Story 1.1 implementation):** self-hosted `@keystatic/core` has no `allowedUsers`-style allowlist field at any published version. The real access boundary is GitHub's own repo-collaborator permission — Keystatic's GitHub storage mode writes using the authenticated user's own OAuth token, so GitHub itself rejects write API calls from non-collaborators. The `/keystatic` login shell may be reachable by any authenticated GitHub user; only the save/write action is actually blocked. See `docs/KEYSTATIC_GITHUB_APP_SETUP.md`.
- **Images — Cloudinary, not git-committed:** Keystatic's built-in image field (which commits binaries to git) is not used. Instead, a custom `cloudinaryField` (ported from `ivocorr`'s `src/components/admin/cloudinary-field.tsx`) uploads directly from the browser to Cloudinary's unsigned upload API and stores only the returned `public_id`. Display URLs are built at render time as `https://res.cloudinary.com/{cloud}/image/upload/{transforms}/{public_id}`.
- **Schema change:** in `src/content/config.ts`, the `refugios` collection's `imagenes` field fully replaces Astro's `image()` helper with a Cloudinary-based field (array of `{publicId, alt}`) — no dual-format code path is kept. This is a real breaking schema change, not additive.
- **Required env vars:** `PUBLIC_KEYSTATIC_GITHUB_REPO`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, `PUBLIC_CLOUDINARY_CLOUD_NAME`, `PUBLIC_CLOUDINARY_UPLOAD_PRESET` (client-visible, admin UI + browser-to-Cloudinary upload need them) plus server-only secrets `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` (32+ char random string) — all documented in `.env.example` and `docs/KEYSTATIC_GITHUB_APP_SETUP.md`.
- **Rendering surfaces to update** to consume Cloudinary `public_id`s instead of local imports: refugio detail page (`src/pages/refugios/[slug].astro`, including its lightbox), refugios listing page (`src/pages/refugios/index.astro`), and the homepage featured-refugio section (`src/pages/index.astro`).
- Existing Zod schema fields for refugios (title, ubicacion, altitud, capacidad, descripcionCorta, descripcionLarga, brindadoA, seoTitle, seoDescription) map to Keystatic field types matching their existing validation constraints (e.g. rich text/markdown for `descripcionLarga`).
- Original local image files under `src/assets/refugios/` may be removed once the Cloudinary migration is verified, or left in place at developer discretion — but no refugio content should reference them afterward.
- Content version history is native via Git: each Keystatic edit is a commit, and this commit history doubles as the content backup mechanism — no separate CMS backup is needed.
- This is explicitly Phase 1 of a two-phase plan; Phase 2 (colaboradores + site copy, via Keystatic singletons mirroring `ivocorr`'s `globalSettings` pattern) is Epic 2 and out of scope here.

## UX & Interaction Patterns

Not applicable — Keystatic provides its own admin UI, and no custom UX spec applies to `/keystatic`. The project's public-site UX spec is unaffected by this epic.

## Cross-Story Dependencies

- Story 1.1 (protected admin access) must land before 1.2 and 1.3, since both require an authenticated `/keystatic` panel to operate in.
- Story 1.3 (Cloudinary image migration/schema change) depends on the `refugios` collection already being manageable per Story 1.2, since it changes that same collection's `imagenes` schema.
- Story 1.4 (client onboarding guide) depends on Stories 1.1–1.3 being complete, since it documents the actual field labels and UI the client will see.
- This epic is a prerequisite for Epic 2: Epic 2 builds on the Keystatic installation, GitHub App, and `cloudinaryField` pattern established here (extending them to colaboradores and static page singletons), but is a separate, deferred capability.

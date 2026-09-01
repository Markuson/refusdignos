---
title: 'Manage Refugio Text Content via Keystatic'
type: 'feature'
created: '2026-09-01'
status: 'done'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md']
baseline_commit: '5302f290ff3d535b44abf1142cf4b5ba5a77e511'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 1.1 mounted the Keystatic admin shell at `/keystatic` with no collections wired up, so the client still can't edit refugio content without a developer touching `src/content/refugios/*.md` directly.

**Approach:** Add a `refugios` collection to `keystatic.config.ts` scoped to the 9 text fields (title, ubicación, altitud, capacidad, both descriptions, brindadoA, SEO fields). Images (`imagenes`, `ogImage`) and `localizacion` stay out of scope (Story 1.3), but must be declared as `fields.ignored()` pass-throughs — confirmed by reading the installed `@keystatic/core@0.5.51` source that any frontmatter key absent from the schema is silently dropped on save, which would otherwise destroy every refugio's photos on first edit.

## Boundaries & Constraints

**Always:** Declare `imagenes`, `localizacion`, `ogImage` as `fields.ignored()` (not omitted) so their values round-trip untouched. Declare a `contentField` (`fields.markdoc({ extension: 'md' })`) so entries keep writing as `.md` — Keystatic derives the file extension only from the content field's format, defaulting to `.yaml` without one. Use `fields.slug()` (not `fields.text()`) for whichever field is `slugField` — a plain text field throws `"slugField is not a slug field"` at runtime — with `title` as that field, so the filename stays independent of the display title, matching existing files (e.g. `bonicaparra.md` vs. `title: "Refugio Bonicaparra"`); `slug()`'s `serializeWithSlug` writes only the name back to frontmatter, never the slug, so `title` stays a flat string. `path: 'src/content/refugios/*'`. Field labels/descriptions are Spanish (the editor is the Spanish-speaking client). `descripcionLarga`'s on-disk YAML block-scalar style (`|`) will be rewritten to folded style (`>`) by Keystatic's `js-yaml` dump on every save — content is preserved, only formatting changes; expected, not a bug.

**Ask First:** Nothing — field mapping and slug behavior are grounded in confirmed library source, not open design choices.

**Never:** Do not add a Cloudinary or upload-capable image field (Story 1.3's job). Do not add `allowedUsers` or any custom access control (settled in Story 1.1). Do not rename/move any existing refugio `.md` file. Do not modify `astro.config.mjs`, `src/content/config.ts`'s Zod schema, or any `.astro` page.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| List | Open Refugios collection in `/keystatic` | All existing entries listed (18 as of writing — re-check `src/content/refugios/` at implementation time) | N/A |
| Create | Fill required fields, save | New `.md` file in `src/content/refugios/`, matching existing schema shape | Missing required field blocks save with inline validation |
| Edit text field | Change e.g. `capacidad`, save | File updated in place; `imagenes`/`localizacion`/`ogImage` byte-identical to before the save | N/A |
| Delete | Confirm deletion in panel | Corresponding `.md` file removed from the repo | N/A |
| Build after CRUD | `pnpm build` | Succeeds, no Zod schema validation errors | Build fails loudly if a schema mismatch is introduced |

</frozen-after-approval>

## Code Map

- `keystatic.config.ts` -- add `import { collection, fields } from '@keystatic/core'`; add `collections: { refugios: collection({...}) }` to the exported `config(...)` (currently has no `collections` key at all, per Story 1.1)
- `src/content/config.ts:4-36` -- authoritative Zod schema the new collection's fields must match key-for-key (9 editable text fields + `imagenes`/`localizacion`/`ogImage` ignored + `title` as slug)
- `src/content/refugios/*.md` (18 files, e.g. `bonicaparra.md`) -- entries are frontmatter-only with an empty body; slugs (filenames) don't derive from `title` text
- Reference, confirmed by reading installed `@keystatic/core@0.5.51` source: `parseEntry`/`serializeEntryToFiles` (`dist/keystatic-core-ui.js:358,395,1892-1899`) drop any frontmatter key not in the schema on save; `getDataFileExtension` (`dist/index-3e2963fd.js:285`) needs a `contentField` for `.md` output; `getSlugFromState` (`dist/index-3e2963fd.js:1227-1232`) requires `slugField` to be `formKind:'slug'`; `slug()`'s `serializeWithSlug` (`dist/keystatic-core.js:3055-3058`) returns `{ value: value.name, slug: value.slug }` -- only `name` is written to frontmatter

## Tasks & Acceptance

**Execution:**
- [x] `keystatic.config.ts` -- add the `refugios` collection: `label: 'Refugios'`, `path: 'src/content/refugios/*'`, `slugField: 'title'`, `format: { contentField: 'content' }`, `entryLayout: 'form'`, and `schema` with `title: fields.slug({ name: { label: 'Título', validation: { isRequired: true } } })`, `content: fields.markdoc({ label: 'Contenido (no utilizado)', extension: 'md' })`, `ubicacion`/`descripcionCorta`/`descripcionLarga` as required `fields.text` (`multiline: true` for the two descriptions), `altitud`/`capacidad`/`brindadoA`/`seoTitle`/`seoDescription` as optional `fields.text` (`multiline: true` for `seoDescription`), and `imagenes`/`localizacion`/`ogImage` as `fields.ignored()` -- wires the admin UI to the content while preventing data loss on the out-of-scope fields

**Acceptance Criteria:**
- Given `pnpm exec tsc --noEmit` targeted at `keystatic.config.ts`, when run, then it reports no type errors on the new collection/field shapes.
- Given an existing refugio is opened and re-saved with no field changes, when the resulting file is diffed, then `imagenes`, `localizacion`, and `ogImage` are unchanged and only `descripcionLarga`'s YAML block style may differ.
- Given `pnpm build`, when it completes, then the same public routes still build successfully.

## Design Notes

`entryLayout: 'form'` is chosen over the `'content'`-layout default because the markdoc `contentField` exists purely to keep `.md` file output (per Boundaries) -- editors never need to see it. `'form'` layout surfaces the real fields as the primary UI instead of a dominant, unused rich-text pane. `fields.ignored()` renders no input (`Input() { return null }`), so the three preserved-but-out-of-scope keys stay invisible to the editor rather than showing as confusing empty fields.

## Verification

**Commands:**
- `pnpm exec tsc --noEmit keystatic.config.ts --module esnext --jsx preserve --moduleResolution bundler --esModuleInterop --skipLibCheck` -- expected: no type errors (same targeted check used in Story 1.1)
- `pnpm dev`, open `/keystatic` → Refugios -- expected: 18 entries listed
- Create a test entry, save, confirm the new `.md` file appears under `src/content/refugios/`; delete it via the panel, confirm the file is removed
- Edit one existing entry's `capacidad`, save, `git diff` the file -- expected: `imagenes`/`localizacion`/`ogImage` unchanged, only `capacidad` and `descripcionLarga`'s YAML style differ
- `pnpm build` -- expected: succeeds, no schema validation errors, same prerendered public pages as before

**Manual checks (if no CLI):**
- Confirm `keystatic.config.ts` still has no `allowedUsers`-style field (regression guard, unrelated to this story's scope)

## Suggested Review Order

**Data safety (why nothing gets silently deleted on save)**

- Entry point: why `imagenes`/`localizacion`/`ogImage`/`fechaPublicacion` are `fields.ignored()` instead of omitted — Keystatic drops any undeclared frontmatter key on save.
  [`keystatic.config.ts:109`](../../keystatic.config.ts#L109)

- `fechaPublicacion` specifically — an undeclared key found only in `es-plans.md`, caught by review, would have been silently deleted without this.
  [`keystatic.config.ts:175`](../../keystatic.config.ts#L175)

**Collection wiring (identity and file format)**

- `slugField: 'title'` paired with `format.contentField: 'content'` — why both are required for `.md` output with filenames independent of the display title.
  [`keystatic.config.ts:140`](../../keystatic.config.ts#L140)

- `fields.slug()` for `title` — must be this field kind, not plain text, or Keystatic throws at runtime.
  [`keystatic.config.ts:144`](../../keystatic.config.ts#L144)

- The unused Markdoc content field, kept for the `.md` extension only, deliberately declared last so it doesn't dominate the form.
  [`keystatic.config.ts:181`](../../keystatic.config.ts#L181)

**Field mapping (the 9 editable fields)**

- `brindadoA` as multiline — holds paragraph text with inline markdown, not a short label.
  [`keystatic.config.ts:168`](../../keystatic.config.ts#L168)

- The remaining required/optional text fields, mapped key-for-key against the Zod schema.
  [`keystatic.config.ts:152`](../../keystatic.config.ts#L152)

**Editor guidance**

- Warning on the title field: a newly created refugio needs a developer to add photos before it will build, since images stay out of scope until Story 1.3.
  [`keystatic.config.ts:147`](../../keystatic.config.ts#L147)

**Peripherals**

- Import list for the new `collection`/`fields` helpers.
  [`keystatic.config.ts:4`](../../keystatic.config.ts#L4)

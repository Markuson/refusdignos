---
title: 'Manage Proyecto Page Copy via Keystatic'
type: 'feature'
created: '2026-09-04'
status: 'done'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md']
baseline_commit: '64bbba0c24059b3b47168c6eb7b667ab1c3014b2'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The "Nuestro Proyecto" page's story, values, impact checklist, and stats are hardcoded directly in `src/pages/proyecto.astro`, so any wording change (e.g. updating the refugio count) requires a developer.

**Approach:** Add a `proyectoPage` Keystatic singleton mirroring Story 2.2's proven pattern (`singleton({path, format:{data:'json'}, schema})`, direct JSON import, no Astro Content Collections). Pre-populate `src/content/proyecto-page/index.json` with today's real values so the migration is visually a no-op, then rewire `proyecto.astro` to read from it. Introduces this repo's first `fields.array` fields for `valores`/`impactoStats` (array of objects, with `itemLabel`) and `impactoChecklist` (array of plain strings).

## Boundaries & Constraints

**Always:** Register `proyectoPage` in `keystatic.config.ts`'s existing `singletons: {}` block (alongside `globalSettings`/`homePage`/`contactoPage`), `path: 'src/content/proyecto-page/'`, `format: { data: 'json' }`. Fields: `heroTitle`, `heroSubtitle` (multiline), `historiaTitle`, `historiaParagraph1`/`2`/`3` (multiline), `valores` — `fields.array(fields.object({icono, titulo, descripcion: multiline}), {itemLabel: (p) => p.fields.titulo.value, validation:{length:{min:1}}})`, `impactoTitle`, `impactoChecklist` — `fields.array(fields.text({label:'Elemento'}), {validation:{length:{min:1}}})`, `impactoStats` — `fields.array(fields.object({numero, etiqueta}), {itemLabel: (p) => p.fields.etiqueta.value, validation:{length:{min:1}}})`, `ctaTitle`, `ctaText` (multiline). All scalar sub-fields `fields.text` with `isRequired`; `numero` is `fields.text` (not integer — current values are `"15"`, `"6"`, `"~1000€"`, mixed format). `historiaParagraph3` loses its inline `<strong>` emphasis on save (flattened to plain text, matching the other two paragraph fields' plain-text shape — no rich-text field is introduced). `proyecto.astro` imports `proyectoPage` from `'../content/proyecto-page/index.json'` and maps `valores`/`impactoChecklist`/`impactoStats` with `.map()` (no `.data` wrapper — that's `getCollection()`-specific, not used by plain JSON singleton imports). `pnpm build` must succeed after any create/edit/delete/reorder of an array item, rendering however many items exist.

**Ask First:** Nothing — every field's current value, line number, and type is resolved by investigation (see Code Map); the `historiaParagraph3` bold-stripping is a deliberate, low-risk content-fidelity trade documented here, not left open.

**Never:** Do not add `proyectoPage` to `src/content/config.ts` (Astro Content Collections). Do not CMS-manage: `BaseLayout`'s SEO `title`/`description` props (lines 12–13), the "Nuestros Valores" section heading, the two inline images (`nosotros1.webp`/`nosotros2.webp`) or their `alt` text, or the 3 CTA buttons' `href`/label pairs at the page bottom — all stay hardcoded, matching Story 2.2's precedent of leaving unlisted sections/SEO/CTA out of scope. Do not touch `colaboradores`/`refugios`/other singletons.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Add/remove/reorder `valores` | Client adds a 4th value card, or reorders the 3 | `proyecto.astro` renders 4 (or reordered) cards, not hardcoded to 3 | N/A |
| Add/remove `impactoChecklist` item | Client adds an 11th checklist line | Renders 11 `✓` lines, not hardcoded to 10 | N/A |
| Edit `impactoStats.numero` | Client changes `"15"` to `"16"` | Stat card shows `16`; `historiaParagraph3`'s prose mention of "15" is a separate text field and does NOT auto-update | N/A (documented drift, not a bug) |
| No admin edits, fresh build | `pnpm build` runs right after migration | Rendered `/proyecto` text is byte-identical to today except `historiaParagraph3`'s bold removed | N/A |

</frozen-after-approval>

## Code Map

- `keystatic.config.ts:398-421` (after existing `contactoPage` singleton, inside the `singletons: {}` block) -- add `proyectoPage` singleton with fields above; first use of `fields.array` with `itemLabel` and of a plain-scalar `fields.array` in this repo (only existing array precedent is `refugios.imagenes` at `keystatic.config.ts:185-201`, an object array with no `itemLabel`)
- `src/content/proyecto-page/index.json` (new) -- pre-populate all 12 fields incl. 3-item `valores`, 10-item `impactoChecklist`, 3-item `impactoStats`, verbatim from `proyecto.astro:19-172` (historiaParagraph3 with `<strong>` stripped to plain text)
- `src/pages/proyecto.astro:19-172` -- replace 9 scalar hardcoded strings + 3 array sections with `proyectoPage` import and `.map()` over `valores`/`impactoChecklist`/`impactoStats`; leave `BaseLayout` SEO props (12-13), "Nuestros Valores" heading (79-81), images (6-8, 40-49, 61-70), and 3 CTA buttons (173-183) untouched

## Tasks & Acceptance

**Execution:**
- [x] `keystatic.config.ts` -- register `proyectoPage` singleton with all 12 fields -- exposes it in the admin panel
- [x] `src/content/proyecto-page/index.json` (new, pre-populated) -- gives the singleton real starting data so the first build is a no-op visually
- [x] `src/pages/proyecto.astro` -- rewire scalar fields + `.map()` the 3 array fields; leave images, SEO props, "Nuestros Valores" heading, and CTA buttons untouched
- [x] `pnpm build` -- verify no schema/import errors and rendered output is unchanged (except the documented `historiaParagraph3` bold removal)

**Acceptance Criteria:**
- Given the `proyectoPage` singleton, when any scalar field is edited and saved, then `proyecto.astro` reflects the change.
- Given an item is added, removed, or reordered in `valores`, `impactoChecklist`, or `impactoStats`, then `proyecto.astro` renders exactly that many items, in that order.
- Given the two inline images and the 3 CTA button destinations, when the singleton is edited, then they remain unchanged (structural, not CMS-managed).
- Given `pnpm build` runs immediately after migration (no admin edits), then rendered text matches today's site except the documented `historiaParagraph3` formatting change.

## Design Notes

`itemLabel` and a plain-scalar `fields.array` are new to this repo (only precedent, `refugios.imagenes`, is an object array with no `itemLabel`) but are documented, stable options on the installed `@keystatic/core@0.5.51` API (`node_modules/@keystatic/core/dist/declarations/src/form/fields/array/index.d.ts`) — not a version risk.

`historiaParagraph3` currently contains `<strong>lo que es de todos, todos debemos cuidarlo</strong>`. Since every other paragraph field in this repo (`homePage.missionParagraph1/2`, `contactoPage.infoSectionText`) is plain `fields.text`, this field follows suit and the bold is dropped rather than introducing a one-off rich-text field for a single phrase.

Numbers embedded in `historiaParagraph3`'s prose ("15 refugios", "seis nuevos cada año") are separate from `impactoStats[0].numero`/`impactoStats[1].numero` and will not auto-sync if the client only updates the stats — no cross-field templating exists in this codebase; this is an accepted, documented limitation, not addressed by this story.

## Verification

**Commands:**
- `pnpm build` -- expected: succeeds, no schema/import errors, `/proyecto` builds
- `pnpm astro check` (or `tsc --noEmit` if unavailable) -- expected: no new type errors

**Manual checks:**
- Diff `/proyecto` before/after this change with no admin edits made -- text must be identical except the documented bold removal.
- Open `/keystatic`, add/remove/reorder an item in each of the 3 array fields, save, rebuild, confirm `proyecto.astro` renders the correct count and order.

## Suggested Review Order

**Schema (new singleton)**

- Entry point: the new `proyectoPage` singleton, mirroring the `contactoPage` pattern immediately above it.
  [`keystatic.config.ts:442`](../../keystatic.config.ts#L442)

- First array-of-objects field with `itemLabel` in this repo (only prior array precedent has none).
  [`keystatic.config.ts:477`](../../keystatic.config.ts#L477)

- First plain-scalar array field (bare `fields.text`, not wrapped in an object); now requires each item, per review patch.
  [`keystatic.config.ts:503`](../../keystatic.config.ts#L503)

- Second array-of-objects field; `numero` is text (not integer) to hold mixed formats like `"~1000€"`, with an editor-facing hint added per review patch.
  [`keystatic.config.ts:513`](../../keystatic.config.ts#L513)

**Pre-populated data**

- Confirm every field is byte-identical to what it replaces, including the 3-item `valores`, 10-item `impactoChecklist`, and 3-item `impactoStats` arrays.
  [`proyecto-page/index.json`](../../src/content/proyecto-page/index.json)

**Page rewiring**

- New singleton import feeding all 12 fields below.
  [`proyecto.astro:9`](../../src/pages/proyecto.astro#L9)

- Deliberate content-fidelity trade: inline `<strong>` emphasis flattened to plain text, matching every other paragraph field in this repo.
  [`proyecto.astro:53`](../../src/pages/proyecto.astro#L53)

- `.map()` over `valores`, rendering however many cards exist instead of 3 hardcoded ones.
  [`proyecto.astro:77`](../../src/pages/proyecto.astro#L77)

- `.map()` over `impactoChecklist`, same variable-count principle.
  [`proyecto.astro:101`](../../src/pages/proyecto.astro#L101)

- `.map()` over `impactoStats`; confirm images, SEO props, CTA buttons, and the "Nuestros Valores" heading stay hardcoded around it.
  [`proyecto.astro:107`](../../src/pages/proyecto.astro#L107)

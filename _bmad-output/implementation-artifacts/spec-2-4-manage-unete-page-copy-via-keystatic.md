---
title: 'Manage Únete Page Copy via Keystatic'
type: 'feature'
created: '2026-09-04'
status: 'done'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md']
baseline_commit: 'd7801ee3ac8afa3b8c0c2ac430753eee879b6062'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The "Únete" page's membership, sponsorship, donation, and FAQ copy is hardcoded directly in `src/pages/unete.astro`, so any wording, pricing, or FAQ change requires a developer.

**Approach:** Add an `unetePage` Keystatic singleton mirroring Story 2.3's proven pattern (`singleton({path, format:{data:'json'}, schema})`, direct JSON import, no Astro Content Collections). Pre-populate `src/content/unete-page/index.json` with today's real values so the migration is visually a no-op, then rewire `unete.astro` to read from it. Reuses this repo's plain-scalar `fields.array` (from `impactoChecklist`) for the four benefit/step lists, and introduces the repo's first array-of-objects field for a Q&A shape (`faqItems`).

## Boundaries & Constraints

**Always:** Register `unetePage` in `keystatic.config.ts`'s existing `singletons: {}` block (after `proyectoPage`), `path: 'src/content/unete-page/'`, `format: { data: 'json' }`. Fields exactly as named in the story AC: `heroTitle`, `heroSubtitle`, `introText`, `haztesocioTitle`, `haztesocioSubtitle`, `haztesocioPriceText`, `haztesocioBenefits` (plain-scalar `fields.array`, 4 items), `transferInstructionsTitle`, `transferInstructionsSteps` (plain-scalar `fields.array`, 3 items), `patrocinadorTitle`, `patrocinadorText`, `patrocinadorBenefitsTitle`, `patrocinadorBenefits` (plain-scalar `fields.array`, 3 items), `donacionTitle`, `donacionSubtitle`, `donacionBenefitsTitle`, `donacionBenefits` (plain-scalar `fields.array`, 5 items), `donacionFooterNote`, `faqItems` (`fields.array` of `fields.object({pregunta, respuesta})` with `itemLabel: (p) => p.fields.pregunta.value`, 3 items), `finalCtaTitle`, `finalCtaText`. All scalar sub-fields `fields.text` with `isRequired`; multiline for any value that renders as a paragraph (`heroSubtitle`, `introText`, `haztesocioSubtitle`, `patrocinadorText`, `donacionSubtitle`, `donacionFooterNote`, `finalCtaText`, `faqItems.respuesta`). Every array uses `validation: { length: { min: 1 } }`. The membership form's fields, validation, and Web3Forms wiring stay in code untouched. `BankDetails.astro` keeps reading bank details from the existing `globalSettings` singleton (Story 2.2) — do not add a duplicate bank-details field here. `unete.astro` imports `unetePage` from `'../content/unete-page/index.json'` and `.map()`s the five array fields (no `.data` wrapper). `pnpm build` must succeed after any create/edit/delete/reorder of an array item.

**Ask First:** Nothing — every field's current value, line number, and type is resolved by investigation (see Code Map); the two inline-emphasis flattenings below are deliberate, low-risk content-fidelity trades documented here, not left open.

**Never:** Do not add `unetePage` to `src/content/config.ts` (Astro Content Collections). Do not CMS-manage: `BaseLayout`'s SEO `title`/`description` props (lines 11–12), the "Paso 1" / "Paso 2" step headers ("Completa el formulario", "Realiza la transferencia"), the "Preguntas Frecuentes" section heading, the membership form itself, the two `<BankDetails>` `concepto` props, or the two "Contáctanos" CTA button hrefs/labels — all stay hardcoded, matching Story 2.2/2.3 precedent of leaving unlisted headings/SEO/CTAs out of scope. Do not touch `globalSettings`, `colaboradores`, `refugios`, or other singletons.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Add/remove/reorder `haztesocioBenefits` (or any of the 4 array fields) | Client adds a 5th membership benefit | `unete.astro` renders 5 items, not hardcoded to 4 | N/A |
| Add/remove/reorder `faqItems` | Client adds a 4th FAQ | Renders 4 Q&A cards, not hardcoded to 3 | N/A |
| Edit `haztesocioPriceText` | Client changes "Por solo 20€ al año" to a new price | Card text updates; membership form's fixed logic is unaffected (price is display copy only) | N/A |
| No admin edits, fresh build | `pnpm build` runs right after migration | Rendered `/unete` text is byte-identical to today except the two documented inline-emphasis flattenings | N/A (documented drift, not a bug) |

</frozen-after-approval>

## Code Map

- `keystatic.config.ts:543` (after `proyectoPage`, inside the `singletons: {}` block, before the closing brace) -- add `unetePage` singleton with fields above; reuses the plain-scalar `fields.array` pattern from `proyectoPage.impactoChecklist` (`keystatic.config.ts:503-513`) for 4 of the 5 arrays, and adds this repo's first array-of-objects Q&A shape (`faqItems`) using the `itemLabel` pattern from `proyectoPage.valores` (`keystatic.config.ts:477-498`)
- `src/content/unete-page/index.json` (new) -- pre-populate all 20 fields verbatim from `unete.astro`, per the line map below
- `src/pages/unete.astro:1-366` -- replace hardcoded strings/lists with `unetePage` import and `.map()` over the 5 array fields:
  - `heroTitle`/`heroSubtitle`: lines 18-21
  - `introText`: lines 30-35
  - `haztesocioTitle`/`haztesocioSubtitle`: lines 46, 48-50
  - `haztesocioPriceText`: line 63 -- currently `Por solo <span class="text-sunrise-orange">20€</span> al año`; flatten to plain text `Por solo 20€ al año` (drops the orange-span emphasis), matching Story 2.3's `historiaParagraph3` precedent for single-field prose containing inline styling
  - `haztesocioBenefits`: lines 66-83 (4 `<li>` items) -- `.map()`, leave the ✓ icon markup in the template
  - `transferInstructionsTitle`: line 207 ("Instrucciones:")
  - `transferInstructionsSteps`: lines 209-211 (3 `<li>` items) -- step 2's `<strong>tu nombre y apellidos</strong>` flattens to plain text `Indica en el concepto tu nombre y apellidos`, same precedent as above
  - `patrocinadorTitle`/`patrocinadorText`: lines 225, 227-230
  - `patrocinadorBenefitsTitle`: line 234
  - `patrocinadorBenefits`: lines 236-248 (3 `<li>` items)
  - `donacionTitle`/`donacionSubtitle`: lines 266, 268-270
  - `donacionBenefitsTitle`: line 276
  - `donacionBenefits`: lines 278-298 (5 `<li>` items)
  - `donacionFooterNote`: lines 299-301
  - `faqItems`: lines 321-345 (3 question/answer card pairs) -- `.map()`
  - `finalCtaTitle`/`finalCtaText`: lines 354, 357
  - Leave untouched: `BaseLayout` SEO props (11-12), "Paso 1"/"Paso 2" headers (55-56, 199-200), the membership form block (86-194), both `<BankDetails>` usages (204, 306), "Preguntas Frecuentes" heading (317-319), both "Contáctanos" CTA buttons (252-254, 360-362)

## Tasks & Acceptance

**Execution:**
- [x] `keystatic.config.ts` -- register `unetePage` singleton with all 20 fields -- exposes it in the admin panel
- [x] `src/content/unete-page/index.json` (new, pre-populated) -- gives the singleton real starting data so the first build is a no-op visually
- [x] `src/pages/unete.astro` -- rewire scalar fields + `.map()` the 5 array fields; leave membership form, BankDetails usages, SEO props, step headers, FAQ heading, and CTA buttons untouched
- [x] `pnpm build` -- verify no schema/import errors and rendered output is unchanged (except the two documented inline-emphasis flattenings)

**Acceptance Criteria:**
- Given the `unetePage` singleton, when any scalar field is edited and saved, then `unete.astro` reflects the change.
- Given an item is added, removed, or reordered in any of the 5 array fields (`haztesocioBenefits`, `transferInstructionsSteps`, `patrocinadorBenefits`, `donacionBenefits`, `faqItems`), then `unete.astro` renders exactly that many items, in that order.
- Given the membership form's fields/validation/Web3Forms wiring and the bank details shown via `BankDetails.astro`, when the singleton is edited, then they remain unchanged (form stays code-owned; bank details keep reading from `globalSettings`).
- Given `pnpm build` runs immediately after migration (no admin edits), then rendered text matches today's site except the two documented inline-emphasis flattenings.

## Design Notes

`haztesocioPriceText` and `transferInstructionsSteps[1]` each currently carry inline styling/emphasis (`<span class="text-sunrise-orange">`, `<strong>`) that a plain `fields.text` can't represent. Following Story 2.3's `historiaParagraph3` precedent, both flatten to plain text on migration rather than introducing one-off rich-text fields for two phrases — a deliberate, documented content-fidelity trade, not a bug.

`faqItems` is this repo's first `fields.array` of `fields.object` modeling a two-field Q&A shape; it follows the same `itemLabel` pattern already proven by `proyectoPage.valores`/`impactoStats`, keyed off `pregunta` instead of `titulo`/`etiqueta`.

## Verification

**Commands:**
- `pnpm build` -- expected: succeeds, no schema/import errors, `/unete` builds
- `pnpm astro check` (or `tsc --noEmit` if unavailable) -- expected: no new type errors

**Manual checks:**
- Diff `/unete` before/after this change with no admin edits made -- text must be identical except the two documented flattenings (price text, transfer step 2).
- Open `/keystatic`, add/remove/reorder an item in each of the 5 array fields, save, rebuild, confirm `unete.astro` renders the correct count and order.
- Confirm the membership form still submits via Web3Forms and both `BankDetails.astro` instances still show the values from `globalSettings`.

## Suggested Review Order

**Schema (new singleton)**

- Entry point: the new `unetePage` singleton, mirroring the `proyectoPage` pattern immediately above it.
  [`keystatic.config.ts:563`](../../keystatic.config.ts#L563)

- Content-fidelity trade: price text drops its orange-span emphasis, matching `proyectoPage.historiaParagraph3`'s precedent.
  [`keystatic.config.ts:591`](../../keystatic.config.ts#L591)

- Plain-scalar array field (bare `fields.text`, not wrapped in an object), reused 4 times in this schema.
  [`keystatic.config.ts:612`](../../keystatic.config.ts#L612)

- First array-of-objects Q&A shape in this repo, `itemLabel` keyed off `pregunta` instead of `titulo`/`etiqueta`.
  [`keystatic.config.ts:676`](../../keystatic.config.ts#L676)

**Pre-populated data**

- Confirm every field is byte-identical to what it replaces, including the two documented flattenings.
  [`unete-page/index.json`](../../src/content/unete-page/index.json)

**Page rewiring**

- New singleton import feeding all 21 fields below.
  [`unete.astro:8`](../../src/pages/unete.astro#L8)

- Deliberate content-fidelity trade: inline color-span emphasis flattened to plain text.
  [`unete.astro:61`](../../src/pages/unete.astro#L61)

- `.map()` over `transferInstructionsSteps`; step 2's `<strong>` emphasis is flattened, same trade as above.
  [`unete.astro:197`](../../src/pages/unete.astro#L197)

- `.map()` over `faqItems`, rendering however many Q&A cards exist instead of 3 hardcoded ones.
  [`unete.astro:289`](../../src/pages/unete.astro#L289)

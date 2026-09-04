---
title: 'Manage Global Settings, Homepage, and Contact Page Copy via Keystatic'
type: 'feature'
created: '2026-09-04'
status: 'done'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md']
baseline_commit: '93704dc4640ad13682033440abd4535ea8a3a57d'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Contact email, social links, and bank details are scattered and duplicated across `src/config/constants.ts`, `Footer.astro`, `BankDetails.astro`, and `contacto.astro` (social URLs are hardcoded independently in both `Footer.astro` and `contacto.astro`; bank details exist only in `BankDetails.astro`). Homepage and contact-page prose is hardcoded directly in `index.astro`/`contacto.astro`. None of this is client-editable.

**Approach:** Add three Keystatic **singletons** (`globalSettings`, `homePage`, `contactoPage`) mirroring the proven pattern in the sibling `ivocorr` project: `singleton({path, format:{data:'json'}, schema})`, stored as `src/content/<name>/index.json`, consumed via a plain static `import` in each `.astro` file (not Astro Content Collections — confirmed `ivocorr` defines a Content Layer schema for this but every real consumer bypasses it with a direct JSON import instead). Pre-populate each JSON file with today's real hardcoded values so nothing changes visually on merge, then rewire the 4 consumer files to read from the singleton instead of a hardcoded/duplicated string.

## Boundaries & Constraints

**Always:** Register singletons via a top-level `singletons: {}` key in `keystatic.config.ts`'s `config({...})` call (sibling to `collections`, not nested in it); import `singleton` from `@keystatic/core` alongside `collection`/`config`/`fields`. Each singleton: `path: 'src/content/<kebab-name>/'` (trailing slash, directory — not a glob), `format: { data: 'json' }`. Consumers import the data file directly, e.g. `import globalSettings from '../content/global-settings/index.json'` — no `getCollection`/`getEntry`, no `src/content/config.ts` entry. `globalSettings` fields: `contactEmail`, `instagramUrl`, `facebookUrl`, `tiktokUrl`, `bankAccountHolder`, `bankName`, `bankIban`, `bankBic` (all `fields.text`, `isRequired`). `homePage` fields (all `fields.text`, `isRequired`, prose ones `multiline`): `heroTitle`, `heroSubtitle`, `heroCtaLabel`, `missionTitle`, `missionParagraph1`, `missionParagraph2`, `missionCtaLabel`, `featuredRefugiosTitle`. `contactoPage` fields: `heroTitle`, `heroSubtitle`, `infoSectionTitle`, `infoSectionText` (multiline). Remove `CONTACT_EMAIL` from `constants.ts` once both its consumers (`Footer.astro`, `contacto.astro`) read `globalSettings.contactEmail` instead — `WEB3FORMS_ACCESS_KEY` stays untouched in `constants.ts` (unrelated, env-sourced secret). `Footer.astro`'s and `contacto.astro`'s social URLs (currently two independent hardcoded copies) both switch to `globalSettings.instagramUrl`/`facebookUrl`/`tiktokUrl`. `BankDetails.astro`'s 4 hardcoded values switch to the matching `globalSettings` fields. `pnpm build` must succeed with identical rendered text to today (a content migration, not a content change).

**Ask First:** Nothing — investigation resolved the read-mechanism question (plain JSON import, not Content Collections) and the exact current value of every field with a concrete source line, not left open.

**Never:** Do not add `globalSettings`/`homePage`/`contactoPage` to `src/content/config.ts` (Astro Content Collections) — confirmed unnecessary and unused by the proven sibling pattern. Do not touch the contact form's fields, validation, Web3Forms wiring, or its own static microcopy (success/error messages, button labels) in `contacto.astro` — only the 4 named `contactoPage` fields are CMS-managed. Do not add homepage sections beyond the 8 named `homePage` fields (e.g. the "Nuestros Colaboradores"/"Apoya el Proyecto" section headings, CTA button labels, or `BaseLayout`'s SEO `title`/`description` props) — out of scope per the epic's exact field list, stays hardcoded. Do not modify `refugios`/`colaboradores` collections or `BankDetails.astro`'s markup structure beyond swapping in the 4 values.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Edit `globalSettings` in Keystatic, save | Editor changes `bankIban` | `src/content/global-settings/index.json` updated via commit; `BankDetails.astro` renders new value after rebuild | Required-field message if cleared |
| Edit `homePage` in Keystatic, save | Editor changes `heroTitle` | `index.astro` hero renders new value after rebuild | Required-field message if cleared |
| Edit `contactoPage` in Keystatic, save | Editor changes `infoSectionText` | `contacto.astro` info section renders new value after rebuild | Required-field message if cleared |
| First build after migration | No admin edits yet | Rendered site text is byte-identical to pre-migration (data pre-populated from current hardcoded values) | N/A |
| `pnpm build` | After any change | Succeeds, no missing-import/schema errors | N/A |

</frozen-after-approval>

## Code Map

- `keystatic.config.ts` -- add `import { singleton } from '@keystatic/core'`; add `singletons: { globalSettings, homePage, contactoPage }` alongside existing `collections`
- `src/content/global-settings/index.json` (new) -- `{contactEmail, instagramUrl, facebookUrl, tiktokUrl, bankAccountHolder, bankName, bankIban, bankBic}`, pre-populated from `constants.ts:1`, `Footer.astro:15,20,25`, `BankDetails.astro:23,28,34,53`
- `src/content/home-page/index.json` (new) -- 8 fields, pre-populated from `index.astro:46-104` (see spec change log / investigation for exact current strings)
- `src/content/contacto-page/index.json` (new) -- 4 fields, pre-populated from `contacto.astro:20-23,186-192`
- `src/config/constants.ts` -- remove `CONTACT_EMAIL`; keep `WEB3FORMS_ACCESS_KEY` untouched
- `src/components/Footer.astro:8,14-27,87,90` -- replace `CONTACT_EMAIL` import + hardcoded `socialLinks` URLs with `globalSettings` import
- `src/components/BankDetails.astro:23,28,34,53` -- replace 4 hardcoded values with `globalSettings` import
- `src/pages/contacto.astro:9,20-23,37,48,59,74,77,186-192` -- replace `CONTACT_EMAIL`/social URLs with `globalSettings` import; replace 4 hero/info strings with `contactoPage` import; form (lines 111-284) untouched
- `src/pages/index.astro:46-104` -- replace 8 hardcoded strings with `homePage` import; `BaseLayout` SEO props (24-25), sponsors/final-CTA sections (177-214) untouched

## Tasks & Acceptance

**Execution:**
- [x] `keystatic.config.ts` -- register `singletons` with `globalSettings`/`homePage`/`contactoPage` -- exposes all three in the admin panel
- [x] `src/content/global-settings/index.json`, `src/content/home-page/index.json`, `src/content/contacto-page/index.json` (new, pre-populated) -- gives every singleton real starting data so the first build is a no-op visually
- [x] `src/config/constants.ts`, `Footer.astro`, `BankDetails.astro` -- rewire to `globalSettings` import, remove `CONTACT_EMAIL` -- closes the duplication the story targets
- [x] `contacto.astro` -- rewire hero/info copy to `contactoPage`, email/social to `globalSettings`; leave form untouched
- [x] `index.astro` -- rewire hero/mission/featured-refugios copy to `homePage`; leave sponsors/final-CTA/SEO untouched
- [x] `pnpm build` -- verify no schema/import errors and rendered output is unchanged

**Acceptance Criteria:**
- Given the `globalSettings` singleton, when any of its 8 fields is edited and saved, then `Footer.astro`, `contacto.astro`, and `BankDetails.astro` all reflect the change and no field remains hardcoded in `constants.ts` or a component.
- Given the `homePage` singleton, when its fields are edited, then `index.astro` reflects the change; hero/mission images and the refugios carousel stay driven by existing assets/collections.
- Given the `contactoPage` singleton, when its fields are edited, then `contacto.astro` reflects the change; the form's fields/validation/Web3Forms wiring remain in code.
- Given `pnpm build` runs immediately after migration (no admin edits), then rendered text matches today's site exactly.

## Design Notes

`ivocorr`'s `content.config.ts` declares a `type:'data'` Content Collection for `global-settings` with a comment claiming `getEntry('global-settings','index')` is the access pattern — but grepping every real consumer (`index.astro`, `InfoModal.astro`, `ContactModal.astro`, `BaseLayout.astro`) shows all four instead do a plain `import globalSettings from '../content/global-settings/index.json'`. That comment is aspirational, not what's actually shipped. This spec follows the proven code, not the stale comment: no `src/content/config.ts` entry for these singletons, just direct JSON imports, which is simpler and avoids introducing a `type:'data'` collection pattern this project has never used.

## Implementation Note (deviation from Code Map)

The Code Map listed `Footer.astro` and `contacto.astro` as `CONTACT_EMAIL`'s only two consumers. Grepping during implementation found three more: `src/pages/legal/terminos.astro`, `src/pages/legal/privacidad.astro` (2 occurrences), and `src/pages/legal/cookies.astro`. Since the "Always" constraint requires removing `CONTACT_EMAIL` from `constants.ts` and `pnpm build` must succeed, all three legal pages were also rewired to `globalSettings.contactEmail` (import swap only -- no other content in those pages was touched, staying consistent with the "Never" boundary that legal-page copy itself is out of scope for this story). This keeps a single source of truth for the contact email and avoids a broken build.

## Verification

**Commands:**
- `pnpm build` -- expected: succeeds, no schema/import errors, all 4 consumer pages/components build
- `pnpm astro check` (or `tsc --noEmit` if the former is unavailable, per Story 2.1 precedent) -- expected: no new type errors

**Manual checks (if no CLI):**
- Diff `pnpm build` output (or visually compare `/`, `/contacto`) before/after this change with no admin edits made -- text must be identical.
- Open `/keystatic`, edit one field per singleton, save, rebuild, confirm the corresponding page reflects it.

## Suggested Review Order

1. `keystatic.config.ts` -- the 3 new `singletons` (`globalSettings`/`homePage`/`contactoPage`): confirm `path`/`format.data:'json'` correctness and full field-name parity against the 3 new JSON files.
2. `src/content/global-settings/index.json`, `home-page/index.json`, `contacto-page/index.json` -- confirm every value is byte-identical to the string it replaces (diff'd against baseline in review).
3. `src/config/constants.ts`, `Footer.astro`, `BankDetails.astro` -- confirm `CONTACT_EMAIL` is fully gone and both consumers read `globalSettings`.
4. `contacto.astro`, `index.astro` -- confirm only the named fields were swapped; form/SEO/carousel/sponsors sections untouched.
5. **Implementation Note** (deviation) -- the 3 legal pages (`terminos`/`privacidad`/`cookies.astro`) also needed rewiring since they imported the removed `CONTACT_EMAIL`; confirm only the import swapped, no other content touched.

**Review outcome (3 parallel passes, 2026-09-04):**
- **blind-hunter:** No bugs, mismatches, or security issues. All JSON keys match schema field names exactly; no dangling `CONTACT_EMAIL` references; output is auto-escaped `{expr}` interpolation (no XSS).
- **edge-case-hunter:** Schema/consumer field parity confirmed clean; no leftover hardcoded duplicates anywhere in `src/`; required-field validation is a proven existing pattern in this codebase. One real, spec-acknowledged latent item found and deferred: `BaseLayout.astro`'s JSON-LD SEO description will drift from `homePage.heroSubtitle` once an editor changes it via Keystatic (out of scope per this story's "Never" boundary; logged in `deferred-work.md`).
- **verification-gap:** Re-ran `pnpm build` and `tsc --noEmit` independently (clean); did a full pre/post-migration build diff across every touched page and confirmed byte-identical rendered text (stronger than the implementer's spot-check claim). Flagged that the live Keystatic admin edit-save-rebuild round trip was not exercised by the implementer -- **closed post-review**: manually verified live in `/keystatic` for all 3 singletons (clean load, no console errors, a `bankName` edit correctly wrote through to `global-settings/index.json`, clearing a required field correctly blocked save with a validation message, then both were reverted and the JSON file confirmed restored to its original byte-for-byte content).

All 4 Acceptance Criteria and all 5 I/O & Edge-Case Matrix rows verified. No patches required.

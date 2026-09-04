- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-manage-refugio-text-content-via-keystatic.md`
  summary: Auto-generate a redirect when an editor renames an existing refugio's slug in Keystatic, so the old public URL keeps working.
  evidence: `fields.slug()` (required for `slugField` -- a plain text field is rejected at runtime) unconditionally renders an editable slug control for existing entries too, confirmed by reading `SlugFieldInput` in the installed `@keystatic/core@0.5.51` source (`node_modules/@keystatic/core/dist/keystatic-core.js:2848`) -- there is no read-only/lock-after-creation option at this version. Renaming an existing entry's slug moves its `.md` file, and since `[slug].astro`'s `getStaticPaths` derives the public URL straight from the filename, the old URL 404s with no redirect. A warning was added on the slug field itself (`keystatic.config.ts`) as an immediate, low-cost mitigation, but it only reduces the chance of the mistake -- it doesn't prevent it. A real fix needs new infrastructure (e.g. a CI step that detects a renamed file under `src/content/refugios/` and writes an entry into Astro's `redirects` config or a Vercel redirect rule on merge), out of scope for Story 1.2.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-migrate-refugio-images-to-cloudinary-and-enable-upload-via-keystatic.md`
  summary: Harden the Cloudinary unsigned upload preset against abuse (restrict allowed formats/max file size/folder in the Cloudinary console) since the cloud name and preset are necessarily bundled into public client-side JS.
  evidence: `PUBLIC_CLOUDINARY_CLOUD_NAME`/`PUBLIC_CLOUDINARY_UPLOAD_PRESET` are read via `import.meta.env` in browser code by design (unsigned upload requires no server round-trip), so both values are visible in the built site's JS bundle. Anyone who reads them can POST directly to Cloudinary's unsigned upload endpoint, bypassing the `/keystatic` GitHub-collaborator auth gate from Story 1.1 entirely. This is inherent to the unsigned-upload architecture chosen in Epic 1's Technical Decisions, not a code defect in this diff -- the mitigation lives in Cloudinary's own preset configuration (format/size/folder restrictions), an operational task outside this repo's code.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-migrate-refugio-images-to-cloudinary-and-enable-upload-via-keystatic.md`
  summary: Add idempotency/resume handling to `scripts/migrate-refugio-images-to-cloudinary.mjs` in case it's ever re-run after a partial failure.
  evidence: The script has no check for already-migrated refugios or already-uploaded images. It ran successfully end-to-end once (69/69 uploads, 17/17 files rewritten, 0 failures), so this risk didn't materialize, but a future partial re-run would re-upload and orphan the images from the earlier attempt (each unsigned upload call mints a fresh Cloudinary `public_id`), since already-migrated `.md` files no longer match the script's `- src:` frontmatter pattern and would instead fail with a generic "could not locate an 'imagenes:' block" error rather than being recognized as already-done.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-migrate-refugio-images-to-cloudinary-and-enable-upload-via-keystatic.md`
  summary: Add a network timeout/retry to the migration script's Cloudinary upload calls, since a single hung request currently stalls the entire one-off run with no feedback.
  evidence: `scripts/migrate-refugio-images-to-cloudinary.mjs` uses plain `fetch` per image with no `AbortController`/timeout and no concurrency control. Didn't manifest during the actual migration run (all 69 uploads succeeded), but there's no recovery path if a future re-run hits a stalled connection.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-migrate-refugio-images-to-cloudinary-and-enable-upload-via-keystatic.md`
  summary: Reconcile the Cloudinary folder convention -- the migration script uploads into per-refugio subfolders (`refugios/<slug>/...`) while the live Keystatic upload field uploads new images into a single flat `refugios/` folder.
  evidence: Both conventions are intentional (commented in the respective files) but leave the Cloudinary media library permanently split between two organizational schemes depending on whether an image arrived via migration or a later manual upload, which will be confusing to anyone browsing the Cloudinary dashboard.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-migrate-refugio-images-to-cloudinary-and-enable-upload-via-keystatic.md`
  summary: Harden `cloudinaryField`'s upload UX -- no XHR timeout (a stalled request leaves the field stuck showing "uploading" forever) and no guard against a second file being selected while an upload is still in flight.
  evidence: `src/components/admin/cloudinary-field.tsx`'s `UploadFieldInput` has no `xhr.timeout`/`ontimeout` handler and no `isUploading` guard at the top of its file-change handler. Confirmed working for the normal single-upload case via live QA in `/keystatic` (success, failure-preset, and validation-blocked-save paths all verified), but these two failure modes weren't exercised and remain unguarded.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-manage-colaboradores-via-keystatic.md`
  summary: Fix admin-panel accessibility gaps in the new `logoField`: labels aren't associated via `htmlFor`/`id` to their inputs, the URL/Upload mode toggle uses `role="radiogroup"`/`role="radio"` with no arrow-key navigation, and error/validation messages have no `role="alert"`/`aria-live`.
  evidence: Confirmed by reading `src/components/admin/logo-field.tsx`'s `LogoFieldInput`. This is an internal `/keystatic` admin control (not the public site, so it's outside the epic's public-site Lighthouse/accessibility constraint), and mirrors gaps already present in the sibling `cloudinary-field.tsx` shipped in Story 1.3, so it isn't a regression -- but both should get an accessibility pass together.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-manage-colaboradores-via-keystatic.md`
  summary: Abort the in-flight Cloudinary `XMLHttpRequest` (and guard callbacks against a since-unmounted component) in `logo-field.tsx` if the editor navigates away from the entry mid-upload.
  evidence: Same unguarded pattern already exists in `cloudinary-field.tsx` (Story 1.3), so this isn't unique to this story, but the new file duplicates it. Low real-world impact (uploads are seconds long) -- worth fixing both together rather than only the new one.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-manage-colaboradores-via-keystatic.md`
  summary: `logoField`'s hardcoded inline hex colors (matching `cloudinaryField`'s existing style) aren't theme-aware; revisit if the Keystatic admin UI ever adds a dark theme.
  evidence: Same styling approach as `cloudinary-field.tsx`, not a regression introduced by this story -- both custom fields would need the pass together.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-manage-colaboradores-via-keystatic.md`
  summary: Add unit/component tests for the custom Keystatic field components (`cloudinary-field.tsx`, `logo-field.tsx`), which contain non-trivial async upload/error-handling logic and currently have zero test coverage.
  evidence: This repo has no test runner configured at all (confirmed: `pnpm lint` fails on a missing ESLint v9 config, and there's no Vitest/Jest/Playwright setup) -- establishing one is a repo-wide decision out of scope for a single story.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-manage-colaboradores-via-keystatic.md`
  summary: Review whether Cloudinary-uploaded SVG logos (allowed by `logoField`'s default `formats`) need server-side sanitization.
  evidence: Rendering is always via `<img src>` (not inline `<svg>`), which mitigates script execution in modern browsers, but this is the first story to let an SVG reach Cloudinary via an unsigned upload with no sanitization step -- worth a deliberate security review rather than silent inclusion.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-manage-global-settings-homepage-and-contact-page-copy-via-keystatic.md`
  summary: Wire `BaseLayout.astro`'s JSON-LD SEO `description` to the `homePage` singleton's `heroSubtitle`, or otherwise decouple them.
  evidence: `BaseLayout.astro:29`'s JSON-LD description is currently a byte-for-byte copy of the original hardcoded hero subtitle string, but per this story's explicit "Never" boundary (SEO props stay hardcoded, out of scope), it was left untouched. Once an editor changes `heroTitle`/`heroSubtitle` via Keystatic, the visible hero text and the SEO/JSON-LD description will silently drift apart. Confirmed via the story 2.2 review's edge-case-hunter pass.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-manage-proyecto-page-copy-via-keystatic.md`
  summary: The emoji icons in `proyectoPage.valores` render with no accessible text alternative (`aria-label`/`role="img"`), and this content is now fully editor-controlled rather than a fixed set of three known emoji.
  evidence: `proyecto.astro` renders `{valor.icono}` as bare text inside a `div` -- the same markup pattern the page already used pre-migration, so this isn't a regression introduced by this story, but the field is now free-text via Keystatic instead of a fixed hardcoded set, so a screen-reader gap that was previously low-risk (3 known emoji) becomes open-ended. Confirmed via the story 2.3 review's blind-hunter pass.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-manage-proyecto-page-copy-via-keystatic.md`
  summary: No repo-wide type-check/test/CI wiring exists to catch a future Keystatic singleton field rename or drop silently shipping a blank page section.
  evidence: Repo-wide grep confirms no test file anywhere imports/exercises `proyectoPage` (or any other singleton), there is no `.github/workflows` CI, and `package.json`'s `check` script (`astro check`) can't actually run because `@astrojs/check` and `typescript` aren't installed as `devDependencies`. This is systemic across every singleton added in Epic 2 (`globalSettings`, `homePage`, `contactoPage`, `proyectoPage`), not specific to this story -- a future field rename in `keystatic.config.ts` without a matching `.astro` template update would render the affected field as blank/`undefined` with nothing in the repo's current tooling catching it before or after merge. Confirmed via the story 2.3 review's verification-gap pass.

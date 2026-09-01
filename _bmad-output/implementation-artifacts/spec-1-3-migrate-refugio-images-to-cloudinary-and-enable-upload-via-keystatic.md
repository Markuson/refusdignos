---
title: 'Migrate Refugio Images to Cloudinary and Enable Upload via Keystatic'
type: 'feature'
created: '2026-09-01'
status: 'done'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md']
baseline_commit: '9e9a536612b113b9c28d9ecc0a0f37c8a1bb6534'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Refugio images are git-committed binaries consumed via Astro's `image()` helper, so the client cannot add or change photos without a developer touching the repo — `imagenes`/`ogImage`/`localizacion` are currently `fields.ignored()` placeholders in Keystatic (Story 1.2), unusable for real editing.

**Approach:** Build a hand-rolled `cloudinaryField` (custom Keystatic field, unsigned browser→Cloudinary upload, stores a bare `public_id` string) into an `imagenes: {publicId, alt}[]` array field; migrate all existing images via a one-off script; replace the Zod `image()` schema with a validated `public_id` shape; update the three rendering surfaces to build Cloudinary URLs directly instead of using `astro:assets`.

## Boundaries & Constraints

**Always:** `cloudinaryField` is a hand-built object (`kind:'form'`, `defaultValue`/`parse`/`serialize`/`validate`/`reader`/`Input`) — `fields.custom()` does not exist in `@keystatic/core@0.5.51`. Compose it as `fields.array(fields.object({ publicId: cloudinaryField({folder:'refugios', required:true}), alt: fields.text({isRequired:true}) }), {validation:{length:{min:1}}})` so Keystatic blocks saving zero images. Zod schema: `imagenes: z.array(z.object({publicId: cloudinaryId, alt: z.string()})).min(1)`, `cloudinaryId = z.string().min(1).refine(v => !v.startsWith('http'))`. Migration script uploads all 69 existing files (17 refugios, `src/assets/refugios/<slug-variant>/`) via the *same* unsigned upload endpoint/preset as the browser field (plain `fetch`, no SDK), then rewrites each `.md`'s `imagenes` frontmatter to `{publicId, alt}`, preserving existing `alt` text — must run before/alongside the schema change so no refugio ever has a schema-invalid or empty `imagenes`. All three rendering surfaces swap `astro:assets <Image>` for plain `<img>` built as `https://res.cloudinary.com/{cloud}/image/upload/{transforms}/{publicId}` (`w_*,f_auto,q_auto`). Simplify `[slug].astro`'s lightbox `img.src.src || img.src` unwrap (now dead once `src` isn't an Astro image object) to plain `img.src`. Add an empty-`imagenes` guard to `refugios/index.astro` before indexing `[0]` (mirrors `index.astro`'s existing `refugiosWithImages` filter). Add `PUBLIC_CLOUDINARY_CLOUD_NAME`/`PUBLIC_CLOUDINARY_UPLOAD_PRESET` to `.env.example`. Cloudinary account is already provisioned: cloud name `olhjkm98`, unsigned upload preset `unsigned-preset`, upload folder `refugios` already created — all go into `.env`/`.env.example` and the field's `folder` option, no new account setup needed. `localizacion`/`ogImage` stay `fields.ignored()` and their Zod shape stays unchanged — confirmed zero usage in all 17 files and no rendering-surface wiring.

**Ask First:** Nothing — field composition, migration approach, and rendering swap are grounded in a confirmed working pattern and current-code inspection, not open design choices.

**Never:** Do not add a Cloudinary SDK/upload-widget npm dependency (plain fetch/XHR suffices for unsigned uploads). Do not delete the original local image files under `src/assets/refugios/` this story (left in place, developer discretion per epic). Do not touch `localizacion`/`ogImage` wiring, Story 1.1's auth code, or any refugio slug/filename.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Upload via Keystatic | Editor picks a file in `cloudinaryField` | XHR to Cloudinary unsigned endpoint; returned `public_id` stored | Upload failure shows inline error, entry not saved |
| Migrate existing images | Run one-off script | All 69 files uploaded to `refugios/<slug>` folder; all 17 `.md` frontmatters rewritten to `{publicId, alt}` | Per-file failures logged; no partial/corrupt frontmatter rewrite |
| Delete last image | Editor removes the only image, saves | Blocked by array `min:1` validation | Inline "at least one image required" |
| Render pages | Migrated entry, any of the 3 surfaces | Cloudinary `<img>` URL renders; lightbox works | N/A |
| `pnpm build` after migration | Full site build | Succeeds, no schema errors | Fails loudly on any malformed/missing `publicId` |

</frozen-after-approval>

## Code Map

- `keystatic.config.ts:176-179` -- replace `imagenes: fields.ignored()` with the composed array + `cloudinaryField`; `localizacion`/`ogImage` untouched
- `src/components/admin/cloudinary-field.tsx` (new) -- hand-built field factory, unsigned XHR upload, returns bare `public_id` string
- `src/content/config.ts:4-38` -- `refugiosCollection` Zod schema; replace `imagenes: z.array(z.object({src: image(), alt: z.string()}))` with `z.array(z.object({publicId: cloudinaryId, alt: z.string()})).min(1)`
- `src/content/refugios/*.md` (17 files) -- frontmatter `imagenes` rewritten from relative `src` paths to `{publicId, alt}` by the migration script
- `src/assets/refugios/<slug-variant>/*.{webp,jpeg}` (69 files, 17 folders) -- source images for migration; left in place afterward
- `scripts/migrate-refugio-images-to-cloudinary.mjs` (new) -- reads each refugio `.md`, uploads its local images via Cloudinary's unsigned upload API, rewrites frontmatter in place
- `src/pages/refugios/[slug].astro:23,95-103,225-311` -- swap `<Image>` for Cloudinary `<img>`; simplify lightbox unwrap (line 241)
- `src/pages/refugios/index.astro:39-47` -- swap `<Image>` for Cloudinary `<img>`; add empty-`imagenes` guard
- `src/pages/index.astro:11-13,~109` -- swap `<Image>` for Cloudinary `<img>` (already guarded via `refugiosWithImages`)
- `.env.example` -- append the two Cloudinary env vars
- Cloudinary account: cloud name `olhjkm98`, unsigned upload preset `unsigned-preset`, upload folder `refugios` -- values for `.env`/`.env.example`

## Tasks & Acceptance

**Execution:**
- [x] `src/components/admin/cloudinary-field.tsx` -- build `cloudinaryField` factory, default `folder:'refugios'` -- proven unsigned-upload pattern, no new deps
- [x] `keystatic.config.ts` -- wire `imagenes` to `fields.array(fields.object({publicId: cloudinaryField(...), alt: fields.text(...)}), {validation:{length:{min:1}}})` -- enables upload UI, blocks zero-image saves
- [x] `src/content/config.ts` -- replace `imagenes` Zod shape with validated `public_id` array, `.min(1)` -- matches new frontmatter shape
- [x] `scripts/migrate-refugio-images-to-cloudinary.mjs` -- one-off script: upload all 69 images, rewrite all 17 frontmatters -- required before the new schema goes live
- [x] Run the migration script against all 17 refugios -- populates real `public_id`s before the schema/page swap lands
- [x] `src/pages/refugios/[slug].astro` -- swap `<Image>` for Cloudinary `<img>`, simplify lightbox unwrap -- consumes new schema
- [x] `src/pages/refugios/index.astro` -- swap `<Image>` for Cloudinary `<img>`, add empty-array guard -- consumes new schema, closes pre-existing crash risk
- [x] `src/pages/index.astro` -- swap `<Image>` for Cloudinary `<img>` -- consumes new schema
- [x] `.env.example` -- add `PUBLIC_CLOUDINARY_CLOUD_NAME`/`PUBLIC_CLOUDINARY_UPLOAD_PRESET` -- documents required config

**Acceptance Criteria:**
- Given `pnpm build` after migration, when run, then it succeeds with zero schema errors and all 17 refugio pages, the listing, and the homepage render images.
- Given an editor opens a migrated refugio in `/keystatic` and re-saves unchanged, when the file is diffed, then `imagenes` entries show only `publicId`/`alt`, no `src` key.
- Given an editor tries to delete a refugio's last remaining image, when they attempt to save, then Keystatic blocks the save with a validation message.
- Given a new image is uploaded via `cloudinaryField`, when the upload completes and the entry is saved, then the page renders it via the constructed Cloudinary URL after rebuild.

## Design Notes

`cloudinaryField` is intentionally not `fields.custom()` — that export doesn't exist at this `@keystatic/core` version; it must match the `BasicFormField` shape directly. The migration script reuses the same unsigned upload endpoint/preset as the browser field (no signed uploads, no SDK) via Node's built-in `fetch`, keeping one upload code path in spirit. Old local image files stay in the repo after migration — developer discretion per epic, avoiding extra churn in an already-breaking-schema story.

## Verification

**Commands:**
- `pnpm exec tsc --noEmit` (targeted at `keystatic.config.ts` + `cloudinary-field.tsx`) -- expected: no type errors
- `node scripts/migrate-refugio-images-to-cloudinary.mjs` -- expected: 69 uploads succeed, 17 files rewritten
- `pnpm build` -- expected: succeeds, all refugio/listing/homepage routes render Cloudinary-backed images
- `pnpm dev`, open `/keystatic` → Refugios → edit one entry -- expected: existing images preview correctly, new upload works, deleting all images blocks save

**Manual checks:**
- Confirm refugio detail lightbox, listing thumbnails, and homepage featured images all load from `res.cloudinary.com` URLs (browser network tab)
- Confirm `.env.example` documents both new Cloudinary vars (detailed client walkthrough deferred to Story 1.4)

## Suggested Review Order

**Custom field (why a hand-built Keystatic field, not a built-in)**

- Entry point: why `fields.custom()` doesn't exist at this version, and the `BasicFormField` shape this constructs instead.
  [`cloudinary-field.tsx:1`](../../src/components/admin/cloudinary-field.tsx#L1)

- Unsigned XHR upload to Cloudinary's REST API, storing only the `public_id` — never a full URL, never a binary in git.
  [`cloudinary-field.tsx:363`](../../src/components/admin/cloudinary-field.tsx#L363)

- `validate()` throws rather than returning a sentinel — matches this project's other Keystatic fields' own convention, verified against live save-blocking behavior.
  [`cloudinary-field.tsx:403`](../../src/components/admin/cloudinary-field.tsx#L403)

- `parse`/`reader.parse` share one `parsePublicId` helper instead of duplicating the same coercion.
  [`cloudinary-field.tsx:71`](../../src/components/admin/cloudinary-field.tsx#L71)

- `keystatic.config.ts` wiring: `imagenes` composed as an array of `{publicId, alt}` with a `min:1` length validation, blocking zero-image saves.
  [`keystatic.config.ts:184`](../../keystatic.config.ts#L184)

**Schema change (breaking: `src` → `publicId`)**

- `cloudinaryId` Zod refinement rejects a value that looks like a full URL — guards hand-edited frontmatter, not the upload UI (which has no free-text input).
  [`config.ts:16`](../../src/content/config.ts#L16)

- `imagenes` array now `.min(1)` — an empty array is a schema violation, not just a UI nicety.
  [`config.ts:43`](../../src/content/config.ts#L43)

**URL construction (one place that knows the Cloudinary URL shape)**

- `buildCloudinaryUrl` — throws if the cloud name env var is missing, rather than silently building a broken URL.
  [`cloudinary.ts:16`](../../src/lib/cloudinary.ts#L16)

- `buildCloudinarySrcSet` — reuses `buildCloudinaryUrl` per width so responsive `srcset` survives the swap away from `astro:assets`.
  [`cloudinary.ts:34`](../../src/lib/cloudinary.ts#L34)

**Rendering surfaces (three call sites, same swap)**

- Detail page also builds `lightboxImages` server-side (plain strings), simplifying the old `img.src.src || img.src` Astro-image unwrap.
  [`[slug].astro:39`](../../src/pages/refugios/%5Bslug%5D.astro#L39)

- Listing page adds an empty-`imagenes` guard before indexing `[0]` — closes a pre-existing crash risk, mirrors the homepage's existing pattern.
  [`refugios/index.astro:22`](../../src/pages/refugios/index.astro#L22)

- Homepage carousel — same `<Image>` → `<img>` swap, already had the equivalent guard.
  [`index.astro:116`](../../src/pages/index.astro#L116)

**Migration (one-off, already run)**

- Entry point: reads each refugio's `imagenes:` block via regex, uploads every local file, rewrites frontmatter to `{publicId, alt}` in place.
  [`migrate-refugio-images-to-cloudinary.mjs:150`](../../scripts/migrate-refugio-images-to-cloudinary.mjs#L150)

- Same unsigned upload endpoint/preset as the browser field, via Node's built-in `fetch` — one upload code path in spirit.
  [`migrate-refugio-images-to-cloudinary.mjs:122`](../../scripts/migrate-refugio-images-to-cloudinary.mjs#L122)

**Peripherals**

- `.env.example` — documents the two required Cloudinary vars, and clarifies they're needed for local dev too (unlike the Keystatic GitHub App section).
  [`.env.example:17`](../../.env.example#L17)

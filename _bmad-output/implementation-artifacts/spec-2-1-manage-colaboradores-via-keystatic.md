---
title: 'Manage Colaboradores via Keystatic'
type: 'feature'
created: '2026-09-04'
status: 'done'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md']
baseline_commit: '3e7fd84f820d7620a2425cf4dd86c6aa8e802092'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `src/content/colaboradores/*.md` (13 sponsor/collaborator entries) has a correct Zod schema already but no Keystatic collection — `keystatic.config.ts` only declares `refugios` — so the client cannot manage sponsors without a developer hand-editing markdown. Unlike refugios, `logo` values are legitimately a mix of external URLs and local `/logos/` paths, so the field can't reuse `cloudinaryField`'s upload-only pattern as-is.

**Approach:** Add a `colaboradores` collection to `keystatic.config.ts` (schema and consumer page both already work with any string `logo` value — neither needs to change). Build a new hand-rolled `logoField` (dual-mode: URL text input OR Cloudinary upload, toggled in the admin UI) that always stores one flat string — an external URL as typed, or a full `res.cloudinary.com` delivery URL resolved via `buildCloudinaryUrl()` right after upload.

## Boundaries & Constraints

**Always:** `logoField` is a hand-built `BasicFormField` object (`kind:'form'`, `defaultValue`/`parse`/`serialize`/`validate`/`reader`/`Input`), the same contract `cloudinaryField` uses, since `@keystatic/core@0.5.51` has no `fields.custom()`. It lives in its own new file and does NOT reuse or modify `cloudinary-field.tsx` — that component is proven in production for refugios and stays untouched; `logoField` only imports `buildCloudinaryUrl` from `src/lib/cloudinary.ts`. Its Cloudinary-upload branch mirrors `cloudinaryField`'s unsigned XHR upload, but on success calls `onChange(buildCloudinaryUrl(public_id, 'f_auto,q_auto'))` — storing a full URL, not a bare `public_id` — so the stored value stays a plain string exactly like today's data, and `src/content/config.ts`'s `logo: z.string()` and `src/pages/colaboradores.astro`'s `<img src={logo}>` (lines 87, 171) need zero changes. The `colaboradores` collection mirrors `refugios`'s `content: fields.markdoc({extension:'md'})` + `format:{contentField:'content'}` pattern (Keystatic needs a content field to derive `.md` output, else defaults to `.yaml`) even though the body stays empty. `slugField: 'nombre'` via `fields.slug({name:{...}})` mirrors refugios' `title`/slug independence — filename stays independent of the human-readable `nombre` value, matching all 13 existing files (e.g. `bellota.md` has `nombre: "Bellota"`).

**Ask First:** Nothing — investigation confirmed the existing Zod schema and consumer page need no changes, and `fields.conditional` (the alternative dual-mode approach) is rejected below with a concrete reason, not left open.

**Never:** Do not use `fields.conditional` for `logo` — confirmed it serializes as a nested `{discriminant, value}` object in frontmatter, which would require a Zod schema change, a migration script rewriting all 13 files, and `colaboradores.astro` changes; the flat-string approach above avoids all three. Do not modify `cloudinary-field.tsx`, the `refugios` collection/schema/pages, or any existing `colaboradores/*.md` file content.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| New/edit entry, URL mode | Editor types an external logo URL | Stored in `logo` exactly as typed | Required-field message if left empty on save |
| New/edit entry, Cloudinary mode | Editor uploads an image | `public_id` resolved via `buildCloudinaryUrl` to a full delivery URL, stored in `logo` | XHR failure shows inline error, entry not saved (mirrors `cloudinaryField`) |
| Switch mode on existing entry | Editor toggles URL ↔ Cloudinary and provides a new value | Previous `logo` value fully replaced by the new mode's stored string | N/A |
| Delete an entry | Editor deletes a colaborador, saves | `.md` file removed via commit | N/A |
| `pnpm build` | After any create/edit/delete | Succeeds, all entries (13 existing + edited) still validate against the unchanged `z.string()` schema | N/A |

</frozen-after-approval>

## Code Map

- `keystatic.config.ts:4-5,137-217` -- add `colaboradores` collection alongside `refugios` in the `collections` object; import `logoField`
- `src/components/admin/logo-field.tsx` (new) -- `logoField` factory: URL-text/Cloudinary-upload toggle, always stores a flat string
- `src/components/admin/cloudinary-field.tsx` -- reference pattern only (`BasicFormField` shape, unsigned XHR upload); NOT modified
- `src/lib/cloudinary.ts:16-24` -- `buildCloudinaryUrl(publicId, transforms)`, reused by `logoField` to resolve an uploaded image to a full URL before storing
- `src/content/config.ts:68-78` -- `colaboradoresCollection` Zod schema (`logo: z.string()`), already correct; NOT modified
- `src/content/colaboradores/*.md` (13 files) -- NOT modified; existing `logo` values (URL or local path) remain valid untouched
- `src/pages/colaboradores.astro:9-20,87,171` -- sole consumer, `getCollection('colaboradores')` + `<img src={logo}>` passthrough; NOT modified

## Tasks & Acceptance

**Execution:**
- [x] `src/components/admin/logo-field.tsx` -- build `logoField({label, folder, required})` factory with a URL/Upload mode toggle; upload branch stores `buildCloudinaryUrl(public_id, 'f_auto,q_auto')` -- lets the client keep legitimate external logos or add new Cloudinary-hosted ones without changing the storage shape
- [x] `keystatic.config.ts` -- add `colaboradores: collection({label:'Colaboradores', path:'src/content/colaboradores/*', slugField:'nombre', format:{contentField:'content'}, schema:{nombre: fields.slug(...), tipo: fields.text(...), descripcion: fields.text({multiline:true}), logo: logoField({folder:'colaboradores', required:true}), url: fields.url(...) (fall back to fields.text with validation if `fields.url` isn't available in this `@keystatic/core` version), orden: fields.integer(...), content: fields.markdoc({extension:'md'})}})` -- exposes the collection in the admin panel matching the existing schema exactly
- [x] `pnpm build` -- verify all 13 existing colaborador entries still validate against the unchanged Zod schema

**Acceptance Criteria:**
- Given an authenticated Keystatic session, when opening "Colaboradores", then all 13 existing entries are listed, matching `src/content/colaboradores/*.md`.
- Given an entry is created, edited, or deleted and saved, then the corresponding markdown file in `src/content/colaboradores/` is created/updated/removed via commit.
- Given the `logo` field, when "URL externa" is chosen, then any typed URL is stored as-is; when "Subir a Cloudinary" is chosen, then the uploaded image's resolved delivery URL is stored — both render correctly on `/colaboradores` with no changes to that page.
- Given `pnpm build` runs after any change, then it succeeds with zero schema errors.

## Design Notes

`fields.conditional` was the first approach considered for the dual-mode `logo` field, since it's Keystatic's built-in primitive for "pick one of several shapes." It was rejected because its runtime/on-disk value is `{discriminant, value}`, not a flat string — adopting it would mean changing the Zod schema, writing a migration script for all 13 existing files, and updating `colaboradores.astro`'s two `<img src={logo}>` sites to unwrap the object. The hand-built `logoField` instead keeps the *field* dual-mode but the *stored value* single-shaped (always a plain string), which is what lets this story avoid touching the schema, the data files, or the consumer page at all — the same "resolve to a display-ready value at write time" idea `cloudinaryField`'s preview logic already uses, just applied at save time instead of render time.

## Verification

**Commands:**
- `pnpm build` -- expected: succeeds, no schema/type errors, `/colaboradores` page builds
- `pnpm astro check` -- expected: no new type errors introduced

**Manual checks (if no CLI):**
- Open `/keystatic` locally, edit an existing colaborador (one URL-mode, one local-path-mode), save without changing `logo`, and diff the file — only intended fields should change.
- Add a new colaborador via Cloudinary upload, save, and confirm the logo renders on `/colaboradores` after `pnpm build`.

## Suggested Review Order

**Collection wiring (entry point)**

- Start here: the new `colaboradores` collection, mirroring `refugios`'s structure with `nombre` as the independent slug field.
  [`keystatic.config.ts:237`](../../keystatic.config.ts#L237)

- Reuses the hand-built dual-mode field instead of `cloudinaryField`, since logos legitimately mix URLs and uploads.
  [`keystatic.config.ts:265`](../../keystatic.config.ts#L265)

**Dual-mode logo field design**

- The factory: same `BasicFormField` contract as `cloudinaryField`, but always resolves to one flat string.
  [`logo-field.tsx:492`](../../src/components/admin/logo-field.tsx#L492)

- Mode inference on open: a value already on this project's Cloudinary cloud reopens in upload mode, everything else in URL mode.
  [`logo-field.tsx:75`](../../src/components/admin/logo-field.tsx#L75)

- Upload branch resolves the returned `public_id` to a full delivery URL *before* storing — the key design choice that avoids any schema/consumer change.
  [`logo-field.tsx:213`](../../src/components/admin/logo-field.tsx#L213)

- URL-mode input: trims, and accepts only `http(s)://` or a leading `/` (matches the 13 existing files' two logo shapes) instead of a strict `new URL()` check.
  [`logo-field.tsx:187`](../../src/components/admin/logo-field.tsx#L187)

**Review-driven robustness patches**

- `JSON.parse` on the success path now fails safely instead of hanging the promise (and `isUploading`) forever on a malformed response.
  [`logo-field.tsx:257`](../../src/components/admin/logo-field.tsx#L257)

- Mode toggle disabled mid-upload so a switch can't let a late-arriving XHR overwrite what the editor is now typing.
  [`logo-field.tsx:333`](../../src/components/admin/logo-field.tsx#L333)

- Upload-mode preview now surfaces a load failure instead of silently showing a broken image.
  [`logo-field.tsx:385`](../../src/components/admin/logo-field.tsx#L385)

**Supporting**

- `autoFocus` is honored (was silently dropped in the first pass) by focusing whichever input is currently visible.
  [`logo-field.tsx:144`](../../src/components/admin/logo-field.tsx#L144)

---
title: 'Client Onboarding Guide for Adding Refugios'
type: 'feature'
created: '2026-09-04'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md']
baseline_commit: '7045ba501e5c34ea0e4393e039dd6b3d536acd40'
---

# Client Onboarding Guide for Adding Refugios

## Intent

**Problem:** With Stories 1.1–1.3 complete, the client can self-serve refugio creation and image upload through `/keystatic`, but has no written walkthrough of the actual fields and UI they'll see, so they can't yet use the CMS confidently without developer support.

**Approach:** Write a Spanish-language client guide (`docs/GUIA_CLIENTE_KEYSTATIC.md`) covering login, every field in the `refugios` form using its real Keystatic label, the Cloudinary image-upload flow with its actual button text, and expected publish timing — cross-checked against `keystatic.config.ts` and `cloudinary-field.tsx` rather than written from generic CMS assumptions. Along the way, fixed a stale in-app field hint in `keystatic.config.ts` that still told editors to "ask a developer to add photos" — a leftover from before Story 1.3 added self-service upload, which would have directly contradicted this guide.

## Suggested Review Order

- Client-facing guide covering login, all form fields with real labels, image upload (including reorder, deletion-blocked-at-min-1, and upload-failure handling), and publish timing.
  [`GUIA_CLIENTE_KEYSTATIC.md:1`](../../docs/GUIA_CLIENTE_KEYSTATIC.md#L1)

- Stale in-app field hint fixed: no longer tells editors to ask a developer for photos, now points them at the self-service "Imágenes" section the guide documents.
  [`keystatic.config.ts:157`](../../keystatic.config.ts#L157)

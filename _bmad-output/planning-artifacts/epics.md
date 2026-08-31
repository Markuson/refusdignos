---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories]
inputDocuments:
  - docs/prd.md
  - docs/Project brief.md
  - docs/ui-architecture.md
  - _bmad-output/planning-artifacts/sprint-change-proposal-2026-08-31.md
---

# RefugiosLibresDignos - Epic Breakdown

## Overview

This document provides the epic and story breakdown for **Iteration II: Keystatic CMS Integration** on RefugiosLibresDignos. Iteration I (MVP) is already live in production; this breakdown covers only the new scope decided in the Sprint Change Proposal (Strapi → Keystatic + Cloudinary pivot), not a re-derivation of already-shipped MVP requirements.

## Requirements Inventory

### Functional Requirements

FR1: The client can create, edit, and delete refugio entries through a web admin interface without developer involvement.
FR2: The admin interface lets the client upload refugio images directly from the browser to Cloudinary via its upload API - images are never committed to the git repository; only the returned Cloudinary `public_id` is stored in the content file.
FR3: Admin access is restricted to a specific, maintainable list of authorized accounts.
FR4: Content changes made in the admin interface go live through the existing Vercel build/deploy pipeline, with no manual deploy step for the client.
FR5 (Phase 2, deferred): The client can manage colaborador/sponsor entries through the same admin interface.
FR6 (Phase 2, deferred): The client can edit static page copy (proyecto, únete, contacto, legal) through the same admin interface.

### NonFunctional Requirements

NFR1 (= PRD NFR14): Content/components structured so CMS integration requires no major refactoring.
NFR2: No new backend, database, or hosting cost introduced by the CMS.
NFR3: No migration of existing content - CMS reads/writes the same markdown files already in the repo.
NFR4: Existing Lighthouse/accessibility standards for the public site must not regress from adding the admin route.
NFR5: Images served via CDN with responsive transforms (Cloudinary), not raw git-committed binaries.

### Additional Requirements

- `@keystatic/astro` + `@astrojs/react`, mounted at `/keystatic` in `astro.config.mjs`
- Storage: `github` mode in production, `local` mode in dev
- GitHub App with `allowedUsers` restricting admin access to specific accounts
- Custom `cloudinaryField` Keystatic field (ported from the `ivocorr` project's `src/components/admin/cloudinary-field.tsx`) - direct browser-to-Cloudinary upload via unsigned upload API, stores only `public_id`
- Env vars: `PUBLIC_KEYSTATIC_GITHUB_REPO`, `PUBLIC_CLOUDINARY_CLOUD_NAME`, `PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- Decision (resolved): `src/content/config.ts` `imagenes` schema for the `refugios` collection fully replaces Astro's `image()` helper with a Cloudinary `public_id` field - the 8 existing refugios' images are migrated to Cloudinary as part of Story 1.3, no dual-format code path
- Update `src/pages/refugios/[slug].astro` (and any other image-rendering code) to build Cloudinary URLs from `public_id` at render time
- Verify Astro build passes with CMS-authored content; verify slug generation still works
- Phase 2 (deferred): singletons pattern for colaboradores/site copy, mirroring `ivocorr`'s `globalSettings` singleton

### UX Design Requirements

N/A - Keystatic provides its own admin UI; no custom UX spec applies to `/keystatic`. The public-site UX spec (`docs/front-end-spec.md`) is unaffected.

### FR Coverage Map

FR1: Epic 1 - create/edit/delete refugios via admin panel
FR2: Epic 1 - Cloudinary image upload (never git-committed)
FR3: Epic 1 - restricted admin access (GitHub App allowedUsers)
FR4: Epic 1 - auto-publish via existing Vercel pipeline
NFR1-5: Epic 1 - all CMS technical constraints
FR5: Epic 2 - colaboradores management
FR6: Epic 2 - static page copy management

## Epic List

### Epic 1: Keystatic CMS for Refugios
Client can independently create, edit, and delete refugio listings - including uploading images to Cloudinary - through a protected admin panel (`/keystatic`), with changes going live automatically via the existing Vercel pipeline. Complete, standalone capability that fully satisfies the client's stated need.
**FRs covered:** FR1, FR2, FR3, FR4, NFR1, NFR2, NFR3, NFR4, NFR5

### Epic 2: Keystatic CMS for Colaboradores and Site Copy (Phase 2 - deferred)
Client can independently manage sponsor/collaborator entries and edit static page copy (proyecto, únete, contacto, legal) through the same admin panel. Builds on Epic 1's Keystatic installation but is a separate, complete capability.
**FRs covered:** FR5, FR6

## Epic 1: Keystatic CMS for Refugios

Client can independently create, edit, and delete refugio listings - including uploading images to Cloudinary - through a protected admin panel (`/keystatic`), with changes going live automatically via the existing Vercel pipeline.

### Story 1.1: Protected Keystatic Admin Access

As a site administrator (Marc or the client),
I want to log into a protected `/keystatic` admin panel using my GitHub account,
So that only authorized people can access content management tools.

**Acceptance Criteria:**

**Given** the Astro project is running in development mode
**When** I navigate to `/keystatic`
**Then** Keystatic loads in local storage mode, reading/writing content files directly on disk, with no GitHub authentication required

**Given** the site is deployed to production on Vercel
**When** an unauthenticated visitor navigates to `/keystatic`
**Then** they are prompted to authenticate via the GitHub App before seeing any admin UI

**Given** a GitHub account is included in the `allowedUsers` list of the Keystatic config
**When** that user authenticates via the GitHub App
**Then** they gain access to the Keystatic admin panel

**Given** a GitHub account is NOT in the `allowedUsers` list
**When** that user attempts to authenticate
**Then** they are denied access to the admin panel
**And** the public site's existing routes continue to build and deploy exactly as before - the admin route is additive, not a modification of existing pages
**And** required env vars (`PUBLIC_KEYSTATIC_GITHUB_REPO`, plus whatever the GitHub App setup needs) are documented in `.env.example`
**And** (NFR4) a post-integration Lighthouse run on the public routes (home, refugios listing, refugio detail) matches or exceeds the existing MVP scores - the admin route's dependencies (React, Keystatic) must not leak into the public site's JS bundle

### Story 1.2: Manage Refugio Text Content via Keystatic

As the client,
I want to create, edit, and delete refugio entries (title, ubicación, altitud, capacidad, descripciones, brindadoA, SEO fields) from the Keystatic panel,
So that I can keep refugio information up to date without asking a developer.

**Acceptance Criteria:**

**Given** I am authenticated in the Keystatic admin panel
**When** I open the "Refugios" collection
**Then** I see a list of all existing refugio entries (the 8 current refugios)

**Given** I create a new refugio entry with all required fields filled in
**When** I save/publish it in Keystatic
**Then** a new markdown file is created in `src/content/refugios/` (in production, via a commit through the GitHub App) matching the existing schema shape

**Given** I edit an existing refugio's text fields
**When** I save the change
**Then** the corresponding markdown file is updated (committed) with the new values, and the Astro build reads the updated content on the next deploy

**Given** I delete a refugio entry in Keystatic
**When** I confirm the deletion
**Then** the corresponding markdown file is removed from the repository
**And** all fields from the existing Zod schema (title, ubicacion, altitud, capacidad, descripcionCorta, descripcionLarga, brindadoA, seoTitle, seoDescription) are editable through Keystatic fields of an appropriate type (text, rich text/markdown for descripcionLarga, etc.), matching the existing validation constraints where practical
**And** after any create/edit/delete via Keystatic, `pnpm build` (or the Vercel build) completes successfully with no schema validation errors
**And** a commit made via Keystatic triggers a normal Vercel deployment, and the change is visible on the live site once that deployment completes - no manual deploy step

### Story 1.3: Migrate Refugio Images to Cloudinary and Enable Upload via Keystatic

As the client,
I want to upload and manage refugio images directly from the Keystatic panel,
So that I can add photos for new or existing refugios without committing files to the code repository.

**Acceptance Criteria:**

**Given** a Cloudinary account and an unsigned upload preset are configured
**When** the custom `cloudinaryField` (ported from the `ivocorr` project) is wired into the Keystatic refugios collection schema
**Then** editors can select an image file in the panel and it uploads directly from the browser to Cloudinary, with only the returned `public_id` stored in the refugio's content file

**Given** the 8 existing refugios currently reference local images via Astro's `image()` helper
**When** the migration is performed
**Then** each existing image is uploaded to Cloudinary once, and each refugio's markdown frontmatter is updated to store the corresponding Cloudinary `public_id`(s) instead of a local file path

**Given** the `imagenes` schema in `src/content/config.ts` is updated
**When** the migration is complete
**Then** the schema fully replaces the `image()`-based field with a Cloudinary `public_id`-based field (array of `{publicId, alt}`) - no dual-format code path remains

**Given** a refugio's `imagenes` data now holds Cloudinary public_ids
**When** the refugio detail page (`src/pages/refugios/[slug].astro`), the refugios listing page (`src/pages/refugios/index.astro`), and the homepage featured-refugio section (`src/pages/index.astro`) render that refugio's images
**Then** each renders a working Cloudinary-hosted image (using an appropriate transform, e.g. responsive width/quality/auto-format) in place of the previous Astro `<Image>` usage, including the lightbox on the detail page
**And** image alt text continues to be editable and is preserved through the migration
**And** the original local image files in `src/assets/refugios/` may be removed once migration is verified (or left in place, per developer judgement at implementation time) but are no longer referenced by any refugio content
**And** `pnpm build` completes successfully afterward with no broken image references

### Story 1.4: Client Onboarding Guide for Adding Refugios

As the client,
I want a short written guide showing how to add a new refugio via `/keystatic`,
So that I can use the CMS confidently without developer support.

**Acceptance Criteria:**

**Given** Stories 1.1-1.3 are complete
**When** the guide is written
**Then** it covers: how to log into `/keystatic`, how to create a new refugio entry with all fields, how to upload images, and how long it takes for a saved change to appear on the live site

**Given** the guide is delivered
**When** the client follows it end-to-end for a real (or test) refugio
**Then** they can successfully publish a new refugio without developer assistance
**And** the guide is written in Spanish (document_output_language), matching the client's language
**And** the guide references the specific field labels/UI the client will actually see in Keystatic (not generic CMS terminology)

## Epic 2: Keystatic CMS for Colaboradores and Site Copy (Phase 2 - deferred)

Client can independently manage sponsor/collaborator entries and edit static page copy through the same admin panel. Full singleton inventory surveyed across every page: 8 singletons total, covering 5 stories below.

### Story 2.1: Manage Colaboradores via Keystatic

As the client,
I want to create, edit, and delete collaborator/sponsor entries (nombre, tipo, descripción, logo, url, orden) from the Keystatic panel,
So that I can keep the sponsors page current without a developer.

**Acceptance Criteria:**

**Given** I am authenticated in Keystatic
**When** I open the "Colaboradores" collection
**Then** I see all existing collaborator entries (matching `src/content/colaboradores/*.md`)

**Given** I create, edit, or delete an entry and save
**Then** the corresponding markdown file in `src/content/colaboradores/` is created/updated/removed via commit

**Given** existing `logo` values are a mix of local `/public/logos/` paths and externally-hosted URLs (company sites/CDNs)
**When** the `logo` field is exposed in Keystatic
**Then** it accepts either an external URL (as today) or a new Cloudinary upload via the same `cloudinaryField` pattern - dual-support is intentional here (unlike refugios), since external logos are legitimate and not something to migrate away from
**And** all existing fields (nombre, tipo, descripcion, url, orden) remain editable with appropriate Keystatic field types matching the existing schema
**And** `pnpm build` succeeds after any change, and both logo forms render correctly on `/colaboradores` and the homepage sponsors section

### Story 2.2: Manage Global Settings, Homepage, and Contact Page Copy via Keystatic

As the client,
I want to edit site-wide contact/bank/social details and the homepage and contact page copy from Keystatic,
So that I can update this information without a developer, and without hunting for it across multiple files.

**Context:** contact email, bank details, and social links are currently hardcoded in 3+ places (`src/config/constants.ts`, `src/components/Footer.astro`, `src/components/BankDetails.astro`, `src/pages/contacto.astro`) - this story consolidates them into one `globalSettings` singleton (mirroring `ivocorr`'s pattern) as the single source of truth.

**Acceptance Criteria:**

**Given** a `globalSettings` singleton with fields: `contactEmail`, `instagramUrl`, `facebookUrl`, `tiktokUrl`, `bankAccountHolder`, `bankName`, `bankIban`, `bankBic`
**When** I edit any of these values in Keystatic and save
**Then** `Footer.astro`, `contacto.astro`, and `BankDetails.astro` all read the updated value - no field is still hardcoded in `constants.ts` or component files

**Given** a `homePage` singleton with fields: `heroTitle`, `heroSubtitle`, `heroCtaLabel`, `missionTitle`, `missionParagraph1`, `missionParagraph2`, `missionCtaLabel`, `featuredRefugiosTitle`
**When** I edit these in Keystatic
**Then** the homepage (`src/pages/index.astro`) reflects the change; the hero/mission images and the refugios carousel remain driven by existing assets/collections, not this singleton

**Given** a `contactoPage` singleton with fields: `heroTitle`, `heroSubtitle`, `infoSectionTitle`, `infoSectionText`
**When** I edit these in Keystatic
**Then** `src/pages/contacto.astro` reflects the change
**And** the contact form's field labels, validation, and Web3Forms wiring remain in code (not CMS-editable) - only surrounding copy is
**And** `pnpm build` succeeds after any change

### Story 2.3: Manage Proyecto Page Copy via Keystatic

As the client,
I want to edit the "Nuestro Proyecto" page's story, values, and impact stats from Keystatic,
So that I can keep the organization's narrative current without a developer.

**Acceptance Criteria:**

**Given** a `proyectoPage` singleton with fields: `heroTitle`, `heroSubtitle`, `historiaTitle`, `historiaParagraph1`, `historiaParagraph2`, `historiaParagraph3`, `valores` (repeatable array of `{icono, titulo, descripcion}`, currently 3 items), `impactoTitle`, `impactoChecklist` (repeatable array of strings, currently 10 items), `impactoStats` (repeatable array of `{numero, etiqueta}`, currently 3 items), `ctaTitle`, `ctaText`
**When** I edit any field, or add/remove/reorder an item in `valores`, `impactoChecklist`, or `impactoStats`, and save
**Then** `src/pages/proyecto.astro` reflects the change, rendering however many items currently exist (not hardcoded to 3 or 10)
**And** the two inline images (`nosotros1.webp`, `nosotros2.webp`) and the CTA buttons' destinations remain structural (not part of this singleton)
**And** `pnpm build` succeeds after any change

### Story 2.4: Manage Únete Page Copy via Keystatic

As the client,
I want to edit the "Únete" page's membership, sponsorship, donation, and FAQ copy from Keystatic,
So that I can adjust pricing, benefits, and FAQs without a developer.

**Acceptance Criteria:**

**Given** an `unetePage` singleton with fields: `heroTitle`, `heroSubtitle`, `introText`, `haztesocioTitle`, `haztesocioSubtitle`, `haztesocioPriceText`, `haztesocioBenefits` (array of strings, currently 4), `transferInstructionsTitle`, `transferInstructionsSteps` (array of strings, currently 3), `patrocinadorTitle`, `patrocinadorText`, `patrocinadorBenefitsTitle`, `patrocinadorBenefits` (array of strings, currently 3), `donacionTitle`, `donacionSubtitle`, `donacionBenefitsTitle`, `donacionBenefits` (array of strings, currently 5), `donacionFooterNote`, `faqItems` (repeatable array of `{pregunta, respuesta}`, currently 3), `finalCtaTitle`, `finalCtaText`
**When** I edit any field, or add/remove/reorder an item in any of the array fields, and save
**Then** `src/pages/unete.astro` reflects the change, rendering however many items currently exist
**And** the membership form's fields, validation, and Web3Forms wiring remain in code (not CMS-editable) - only surrounding copy is
**And** the bank details shown (via `BankDetails.astro`) continue to read from the `globalSettings` singleton from Story 2.2, not a duplicate value here
**And** `pnpm build` succeeds after any change

### Story 2.5: Manage Legal Page Copy via Keystatic

As the client,
I want to edit the privacy policy, terms, and cookie policy text from Keystatic,
So that I can update legal copy (e.g. a changed "last updated" date or a wording fix) without a developer.

**Acceptance Criteria:**

**Given** three singletons - `legalPrivacidad`, `legalTerminos`, `legalCookies` - each with fields `lastUpdated` (text/date) and `body` (rich text/markdown holding the full document)
**When** I edit a singleton's `lastUpdated` or `body` and save
**Then** the corresponding page (`src/pages/legal/privacidad.astro`, `terminos.astro`, `cookies.astro`) renders the updated content
**And** `pnpm build` succeeds after any change
**And** (governance note, not a technical gate) because this is legally-reviewed content, the client onboarding material for this story should recommend changes get a second read before publishing, echoing the "4 eyes" review principle already noted in `docs/Project brief.md` section 5.9 - Keystatic does not enforce this, it's a process recommendation

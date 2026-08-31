# Sprint Change Proposal — 2026-08-31

## 1. Issue Summary

**Trigger:** The client needs to add/edit refugios (mountain shelters) themselves, without a developer. The documented Iteration II plan across `docs/prd.md`, `docs/Project brief.md`, and `docs/ui-architecture.md` committed to **Strapi** — a separate headless CMS requiring its own Node.js/PostgreSQL hosting, an API-fetching layer in Astro, and a content migration from markdown to Strapi's data model.

**Issue type:** Strategic pivot / technology choice correction, identified before any Iteration II work started (no rollback required — nothing built yet against the old plan).

**Discovery context:** Raised during a `bmad-help` session assessing next steps after MVP (Iteration I) launch. No epics/sprint backlog exists yet for this project, so there was nothing in-flight to reconcile — the correction applies to forward-looking planning docs only.

## 2. Impact Analysis

**Epic Impact:** N/A — no epics/stories tracked for this project yet. The upcoming `bmad-create-epics-and-stories` pass will define the Keystatic work fresh.

**Artifact Conflicts (resolved in this proposal):**
- `docs/prd.md` — Executive Summary, NFR14, Technical Assumptions (repo structure, future evolution path, testing), Architect Handoff appendix
- `docs/Project brief.md` — Spanish-language sections on iteration strategy, scope, content modeling, tech stack, architecture, security, risks, KPIs, timeline (30+ references)
- `docs/ui-architecture.md` — "Future-Proof" notes, the entire "API Integration" section (replaced with "Content Management (Keystatic)"), `.env.example`, TypeScript env types
- `README.md`, `docs/development-roadmap.md` — roadmap iteration descriptions

**No conflict:** `docs/front-end-spec.md` (UX spec covers the public site, not admin tooling — Keystatic's admin UI isn't something this project designs).

**Technical impact:** None yet — Iteration I (MVP) is unaffected; this is a correction to forward-looking documentation only, ahead of any Iteration II implementation.

## 3. Recommended Approach

**Selected:** Option 1 — Direct Adjustment (update documentation only). No rollback needed, no MVP scope change.

**Effort:** Low-Medium (documentation only; the follow-on epic/story work is separate). **Risk:** Low.

**Rationale:** Keystatic is a better technical fit than Strapi for this project's actual need, not just a cheaper one — it edits the same Astro Content Collections already in place (via a GitHub App, writing commits directly to the repo), requiring no new backend, no database, no hosting cost, and no content migration.

## 4. Detailed Change Proposals

### Technology decision (net new, folded into the correction)

- **CMS:** Keystatic (`@keystatic/astro`), admin route at `/keystatic`, `github` storage mode in production (`local` in dev), same pattern already working in the `ivocorr` project.
- **Access control:** GitHub App `allowedUsers` list restricts `/keystatic` to the client's own GitHub account(s) — same mechanism as `ivocorr`.
- **Images:** Cloudinary, not git-committed binaries. A custom Keystatic field (`cloudinaryField`, ported from `ivocorr`) uploads directly from the browser to Cloudinary's unsigned upload API and stores only the `public_id` — never a full URL or binary in git.
- **Phasing:**
  - **Phase 1:** Keystatic wired to the `refugios` collection only, with the Cloudinary field for refugio images.
  - **Phase 2 (follow-up):** extend to `colaboradores`/sponsors and remaining site copy (proyecto, únete, contacto, legal), likely as Keystatic singletons for one-off page text (mirroring `ivocorr`'s `globalSettings` singleton).

### Documents corrected (applied)

| File | Change |
|---|---|
| `docs/prd.md` | NFR14, Executive Summary, Technical Assumptions (repo structure, future evolution path bullets, testing), Architect Handoff appendix — all Strapi mentions replaced with the Keystatic/Cloudinary model |
| `docs/Project brief.md` | Full pass across sections 1, 5, 7, 9, 10, 11 — iteration strategy, content modeling (`imagenes` field now Cloudinary `public_id`), tech stack, architecture, security/backup posture (Git-as-backup), risks, KPIs, timeline/milestones |
| `docs/ui-architecture.md` | "Future-Proof" bullet, "Future Considerations", TypeScript-strict rationale, and the entire "API Integration" section replaced with "Content Management (Keystatic)" (integration approach, Cloudinary field, phasing); `.env.example` and `ImportMetaEnv` updated to `PUBLIC_KEYSTATIC_GITHUB_REPO` / `PUBLIC_CLOUDINARY_CLOUD_NAME` / `PUBLIC_CLOUDINARY_UPLOAD_PRESET` in place of `STRAPI_URL` / `STRAPI_TOKEN` |
| `README.md` | Roadmap line for Iteration II |
| `docs/development-roadmap.md` | Iteration II section (Phase 1/Phase 2 breakdown, revised week estimate), Iteration V product-catalog note |

All edits verified — zero remaining case-insensitive matches for "strapi" across `docs/` and `README.md`.

## 5. Implementation Handoff

**Scope classification: Moderate** — documentation correction is complete (this proposal); the actual Keystatic build is new work requiring backlog creation.

**Next step:** `bmad-create-epics-and-stories`, to define:
- **Epic A (Phase 1):** Keystatic + Cloudinary for the `refugios` collection — install/config, `/keystatic` route, GitHub App + `allowedUsers`, custom Cloudinary field, schema change for `imagenes`, verify Astro build against CMS-authored content, client documentation/handoff.
- **Epic B (Phase 2, follow-up):** extend Keystatic to `colaboradores` and remaining site copy via singletons.

**Owner:** Developer agent (Amelia) / PO for backlog creation — no PM/Architect replan needed, the architecture correction is already captured above.

**Success criteria:** `docs/prd.md`, `docs/Project brief.md`, `docs/ui-architecture.md`, `README.md`, and `docs/development-roadmap.md` consistently describe Keystatic + Cloudinary (not Strapi) as the Iteration II plan; ready for epic/story authoring.

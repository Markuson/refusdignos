---
title: 'Protected Keystatic Admin Access'
type: 'feature'
created: '2026-09-01'
status: 'done'
review_loop_iteration: 1
context: []
baseline_commit: '04ff6f9ea7a6602ceb76aad5f88532e4b15ce485'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The client cannot manage site content without a developer touching code and committing directly to the repo. This story lays the foundation: an admin route at `/keystatic`, with no content-editing capability wired up yet (that's Story 1.2).

**Approach:** Add Keystatic (`@keystatic/astro` + `@astrojs/react`) to the Astro app, mounted at `/keystatic`. Local dev uses Keystatic's `local` storage mode (no auth). Production uses `github` storage mode via a GitHub App (guide already written to `docs/KEYSTATIC_GITHUB_APP_SETUP.md`). **Renegotiated after review:** self-hosted `@keystatic/core` has no `allowedUsers`-style config field at any published version (confirmed through 0.6.9) — it does not exist, not a version gap. The real production access boundary is GitHub's own repo-collaborator permission: Keystatic's GitHub mode writes content using the authenticated user's own OAuth token, so GitHub itself rejects write API calls from anyone who isn't a collaborator with write access on `Markuson/refusdignos`. The `/keystatic` login shell may still be reachable by any authenticated GitHub user, but only collaborators can successfully save. The client is added as a GitHub collaborator only when ready to hand off editing (Story 1.4), not before.

## Boundaries & Constraints

**Always:** No `allowedUsers` or equivalent allowlist config field is used in `keystatic.config.ts` — it does not exist in `@keystatic/core` and must not be claimed or implied anywhere in code or docs. The only production access boundary is GitHub's native collaborator permission on the repo. No collections/singletons are defined yet — an empty Keystatic config (aside from storage) is correct for this story; Story 1.2 adds the `refugios` collection. The public site's existing routes and build output must be unaffected — Keystatic's routes are additive (`/keystatic/[...params]`, `/api/keystatic/[...params]`), both `prerender: false`. `keystatic.config.ts`'s `repo` field must satisfy `@keystatic/core`'s actual `RepoConfig` type (`{ owner, name }`), not a plain `"owner/name"` string. The new admin routes must be excluded from search-engine crawling.

**Ask First:** Nothing during execution — all real secrets are deferred to the human via the setup guide already written.

**Never:** Do not implement a custom allowlist/middleware wrapping Keystatic's routes (considered and explicitly rejected in favor of relying on GitHub's native permissions). Do not attempt to create the GitHub App or obtain real client ID/secret values. Do not wire up any content collection or field in this story. Do not commit real secret values anywhere — only placeholder examples in `.env.example`. Do not add a project-wide type-checking toolchain (`@astrojs/check`/`typescript`) — that gap predates this story and is a separate decision.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Local dev | `pnpm dev`, visit `/keystatic` | Keystatic UI loads in `local` mode, no login prompt | N/A |
| Prod, env vars unset | GitHub App env vars not yet configured | `keystatic.config.ts` throws a clear, actionable error identifying the missing variable(s) rather than failing opaquely deep in Keystatic's own code | Explicit guard in config, not left to Keystatic's internals |
| Prod, GitHub collaborator | A repo collaborator completes OAuth | Redirected back, admin panel loads, saves succeed (unverifiable here — needs the real GitHub App; documented as a manual follow-up) | N/A |
| Prod, non-collaborator | A GitHub account without repo write access completes OAuth | Per current understanding of the library, the admin UI may still load, but any save/write attempt is rejected by GitHub's own permission check | Documented as a known characteristic of self-hosted Keystatic, not a bug to fix here |
| Search engines | Crawler requests `/keystatic` or `/api/keystatic/*` | Disallowed via `robots.txt` | N/A |

</frozen-after-approval>

## Code Map

- `astro.config.mjs` -- add `react()` and `keystatic()` to `integrations`
- `package.json` -- add `@keystatic/astro@^5.0.6`, `@keystatic/core@^0.5.50`, `@astrojs/react@^5.0.5`, `react@^19.2.6`, `react-dom@^19.2.6`, `@types/react@^19.2.14`, `@types/react-dom@^19.2.5` (previous attempt omitted `@types/react-dom`, an unmet peer of `@astrojs/react`)
- `keystatic.config.ts` (new, repo root) -- `storage` branches on `import.meta.env.DEV`; production branch parses `PUBLIC_KEYSTATIC_GITHUB_REPO` (`"owner/name"`) into the `{ owner, name }` shape `RepoConfig` actually requires (previous attempt passed a raw string, which fails `tsc`); no `allowedUsers`; throws a clear error at config-eval time if any required prod env var (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_GITHUB_APP_SLUG`, `KEYSTATIC_SECRET`) is missing when not in dev
- `.env.example` -- add `PUBLIC_KEYSTATIC_GITHUB_REPO` plus commented placeholders for the four secrets, with a note on `KEYSTATIC_SECRET`'s 32-character minimum (verified in the installed package's runtime check)
- `src/env.d.ts` (new) -- `ImportMetaEnv` typing for `PUBLIC_KEYSTATIC_GITHUB_REPO`
- `public/robots.txt` -- add `Disallow: /keystatic` and `Disallow: /api/keystatic` under the existing `User-agent: *` block
- `docs/KEYSTATIC_GITHUB_APP_SETUP.md` (already exists) -- correct the two claims that `allowedUsers` denies non-listed accounts (false); replace with an explanation of the GitHub-collaborator-permission model; correct the note about testing github-mode locally via `.env` (doesn't work — `astro dev` always sets `DEV=true`; real local verification of github-mode needs `pnpm build && pnpm preview` plus registering an additional `http://127.0.0.1:.../api/keystatic/github/oauth/callback` on the GitHub App); note that Vercel Preview deployments (per-PR URLs) won't complete OAuth unless their callback is also registered — out of scope to solve here, just documented
- Reference: `@keystatic/astro` injects `/keystatic/[...params]` (UI) and `/api/keystatic/[...params]` (API), both `prerender: false` -- confirmed by reading the installed package source
- Reference: confirmed via `npm pack` + reading `dist/declarations/src/config.d.ts` across `@keystatic/core` 0.5.51 through the current latest 0.6.9 that `GitHubStorageConfig` is `{ kind: 'github'; repo: RepoConfig } & CommonRemoteStorageConfig` -- no allowlist field exists at any version

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- add the seven dependencies listed above -- required for Keystatic + its React UI, with the peer dependency gap closed
- [x] `astro.config.mjs` -- import and register `react()` and `keystatic()` in `integrations` -- mounts the admin routes
- [x] `keystatic.config.ts` -- create with dev/prod storage branching, correctly-typed `repo`, no `allowedUsers`, and a startup guard for missing prod env vars -- the corrected access model
- [x] `.env.example` -- document all required env vars with placeholder values and the `KEYSTATIC_SECRET` length requirement
- [x] `src/env.d.ts` -- add `PUBLIC_KEYSTATIC_GITHUB_REPO` to `ImportMetaEnv`
- [x] `public/robots.txt` -- disallow `/keystatic` and `/api/keystatic`
- [x] `docs/KEYSTATIC_GITHUB_APP_SETUP.md` -- write the setup guide (the file did not actually exist in the repo despite the spec assuming it did -- see Spec Change Log); ships with the correct GitHub-collaborator-permission model from the start, correct local-testing instructions, and the Preview-deployment OAuth limitation noted

**Acceptance Criteria:**
- Given `pnpm dev` is running, when visiting `/keystatic`, then the Keystatic UI loads in local mode with no auth prompt and no collections listed.
- Given `pnpm build`, when the build runs, then it completes successfully and every existing public route still builds unchanged.
- Given `pnpm exec tsc --noEmit` is run against `keystatic.config.ts`, when checked, then it reports no type errors on the `storage`/`repo` shape.
- Given the new dependencies are installed, when `pnpm build` runs, then no dependency conflicts or peer-dependency errors occur.
- Given `keystatic.config.ts`, when read, then it contains no `allowedUsers` field anywhere, and the storage branch is keyed off `import.meta.env.DEV`.
- Given required prod env vars are unset and the production storage branch is evaluated, when the config loads, then it throws a clear error naming the missing variable(s).
- Given `public/robots.txt`, when read, then it disallows `/keystatic` and `/api/keystatic`.

## Spec Change Log

- **2026-09-01, implementation:** Four implementation-time findings, all corrected in-flight (Code Map/Tasks/Verification are not inside the frozen block, so these are documented here rather than treated as renegotiations of frozen intent):
  1. **`docs/KEYSTATIC_GITHUB_APP_SETUP.md` did not exist in the repo** -- the spec's Code Map assumed it "already exists" and needed correcting, but the working tree (and full git history) had no such file. Written from scratch with the corrected GitHub-collaborator-permission model baked in, since there was nothing to "correct" against.
  2. **Env var name fix:** the spec's Code Map listed `KEYSTATIC_GITHUB_APP_SLUG`, but reading the installed `@keystatic/astro@5.2.0` source (`dist/keystatic-astro-ui.js`) shows the admin UI actually reads `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (PUBLIC_-prefixed, since it's read client-side to build the GitHub-install link). Used the correct name throughout (`keystatic.config.ts`, `.env.example`, setup doc) -- the other three secret names (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`) were verified correct as-specified against `@keystatic/core`'s API handler source.
  3. **Guard had to be gated to server-only evaluation:** `keystatic.config.ts` is imported by both Keystatic's server-only API route and its `client:only="react"` admin page, which Vite bundles separately for the browser. A naive missing-env-var check would read as "always missing" in the client bundle (non-`PUBLIC_` vars are correctly stripped from client code by Vite) and throw there even when the server is fully configured, breaking the admin UI for everyone. Fixed by gating the check on `import.meta.env.SSR` (a build-time constant Vite/Astro provide, `true` server-side / `false` client-side), which also means the guard code is eliminated from the client bundle entirely.
  4. **Verification command needed a flag added to actually run:** `pnpm exec tsc --noEmit keystatic.config.ts --jsx preserve --moduleResolution bundler --esModuleInterop --skipLibCheck` fails immediately with `TS5095` (bundler resolution requires `module` to be `preserve`/`es2015`+, and bare `tsc` defaults to CommonJS when no tsconfig is picked up because explicit files were passed on the command line). Ran with `--module esnext` added (matching this project's own `astro/tsconfigs/strict` base) -- passes with no errors on the storage/repo shape.

  All Execution tasks and Acceptance Criteria are satisfied; see the story's implementation report for verification evidence.

- **2026-09-01, review loop 1 (intent_gap):** Verification-gap review found `allowedUsers` does not exist in `@keystatic/core`'s `GitHubStorageConfig` type at any published version (checked 0.5.51 through 0.6.9) and is never read by the OAuth callback — the original frozen intent's access-control invariant was factually wrong. Human chose to accept GitHub's native repo-collaborator permission as the real access boundary rather than build custom allowlist middleware. Frozen Intent/Boundaries rewritten accordingly. **KEEP:** the overall approach (Keystatic + Cloudinary-free-for-this-story, `local`/`github` storage branching, GitHub App per `docs/KEYSTATIC_GITHUB_APP_SETUP.md`) is unchanged and worked correctly in the reverted implementation — only the access-control claim was wrong. Also folded in the blind-hunter/edge-case-hunter findings from the same review pass (repo type shape, missing `@types/react-dom`, `robots.txt` crawlability, inaccurate local-testing docs, undocumented `KEYSTATIC_SECRET` length) since they're cheap, in-scope fixes discovered in the same pass — not deferred.

- **2026-09-01, review loop 2 (patch round):** Second review pass on the corrected implementation surfaced one genuine regression the orchestrator introduced while patching round-1 findings, plus several smaller real gaps — all fixed in place (patch, not intent_gap: root cause was in Code Map-level implementation detail, not the frozen Intent/Boundaries):
  1. **Critical: reverted an incorrect `process.env` "fix".** While patching round 1's findings, the orchestrator changed the three server-only secret checks from `import.meta.env` to `process.env`, reasoning that would avoid a stale-build-snapshot drift. Round 2's verification-gap review proved this backwards by reading `@keystatic/astro`'s actual handler source (`dist/keystatic-astro-api.js`): it resolves `clientId`/`clientSecret`/`secret` via `import.meta.env.KEYSTATIC_*`, not `process.env` — confirmed both in the package source and by inspecting this project's own compiled output, where an unset var literally dead-code-eliminates to `return undefined;`. The `process.env` version made the guard actively wrong: it would report "configured" using a live value while Keystatic's real handler used a stale/absent frozen one. Reverted to `import.meta.env` for all four vars, matching Keystatic's actual read mechanism exactly so the two can never disagree. **KEEP:** the `import.meta.env.SSR`-gated client/server split, and the overall shape of `assertProdServerEnv`/`parseRepoConfig`, both worked correctly throughout — only the env-source choice for the three secrets was wrong, twice in a row, before landing on the version that matches Keystatic's real behavior.
  2. **Guard logic was never actually executed by any prior verification step.** `pnpm build` only bundles the production branch, it doesn't run it (`prerender: false` code executes per-request, not at build time) — confirmed by running a full `pnpm build` with deliberately invalid config and observing no error. Closed this gap empirically rather than just noting it: built the compiled `.vercel/output` function artifact under four real conditions (vars missing / all valid / malformed repo string / too-short secret) and directly imported the compiled module each time to force real execution of the top-level guard code, confirming the exact expected error (or lack thereof) in all four cases. This is a repeatable manual technique, not automated tooling — recorded under Verification below.
  3. **Added a `KEYSTATIC_SECRET` length check** (≥32 chars) in `assertProdServerEnv`, matching `@keystatic/core`'s own internal minimum, so a too-short secret fails at the same clear edge as a missing one instead of surfacing later from inside Keystatic's internals. Empirically verified (see above).
  4. **`parseRepoConfig`** now rejects owner/name segments containing characters outside `[\w.-]` (e.g. stray whitespace), not just missing/extra segments.
  5. **Doc fixes:** corrected the setup guide's version-range comment (the `^0.5.51` pin can only ever resolve within `0.5.x`, so "confirmed absent through 0.6.9" was reworded to be about the library's design, not an implied future-proof guarantee of this exact pin); reconciled §2 telling the reader to set vars for "any deploy target" against §4's Preview-deployment limitation (now explicitly Production-only); added a note that rotating `KEYSTATIC_SECRET` silently logs out already-signed-in editors (their session cookie, encrypted with the old secret, becomes unreadable).

  Not fixed (deferred, pre-existing or genuinely out of scope, not caused by this story): `@keystatic/core` version pinned to `^0.5.51` rather than latest `0.6.9` (a separate upgrade decision); no `X-Robots-Tag: noindex` header alongside `robots.txt` (robots.txt is what the frozen AC specifically named as sufficient); the new setup doc isn't linked from `README.md`'s Documentation section (pre-existing convention gap — `WEB3FORMS_SETUP.md` isn't linked either); GitHub App ownership/succession planning and its "Expire user authorization tokens" setting (operational decisions for whoever administers the App, not a code correctness issue).

## Design Notes

Production GitHub-mode auth (both the collaborator-permission success path and the non-collaborator rejection path) cannot be end-to-end verified in this story — it requires a real GitHub App and a second GitHub account to test against. This story's AC is scoped to what's verifiable now: local mode works, the build stays green, the config has no false allowlist claim and fails loudly if misconfigured (empirically verified by forcing execution of the compiled guard under four conditions — see Verification), and the crawl-block is in place. Full prod verification happens once the human completes the external setup — a manual follow-up, not a blocking AC here.

## Verification

**Commands:**
- `pnpm install` -- expected: no errors, lockfile updates cleanly, includes `@types/react-dom` and `@types/react` in devDependencies
- `pnpm exec tsc --noEmit keystatic.config.ts --module esnext --jsx preserve --moduleResolution bundler --esModuleInterop --skipLibCheck` -- expected: no type errors on the storage/repo shape (a full project-wide `astro check` is out of scope per Never above; this is a narrow, targeted type check of the one new file)
- `pnpm dev` then visit `/keystatic` -- expected: Keystatic admin UI loads, local storage mode, no auth screen; verified via `curl` returning HTTP 200 with the Astro-island hydration markup, no auth redirect
- `pnpm build` -- expected: succeeds, same 27 prerendered pages as before plus the two new on-demand routes (`/keystatic`, `/api/keystatic/*`) bundled separately (confirmed the Keystatic/React JS chunk is never referenced by the homepage's own script tags -- no leakage into the public bundle, satisfying NFR4)

**Guard-execution verification (manual technique -- module top-level code only runs when the compiled function is actually invoked, not during `pnpm build` itself):**
- Set all four required vars + a well-formed repo in `.env`, `pnpm build`, then `node -e "import('.vercel/output/functions/_render.func/dist/server/pages/api/keystatic/_---params_.astro.mjs')"` -- expected and confirmed: import succeeds, no throw
- Remove all four vars, rebuild, repeat the import -- expected and confirmed: throws naming exactly the four missing variables
- Set a malformed `PUBLIC_KEYSTATIC_GITHUB_REPO` (e.g. `not-valid-format`) with the other three vars present, rebuild, repeat the import -- expected and confirmed: throws the "must be in owner/name format" error
- Set `KEYSTATIC_SECRET` to a string under 32 characters with everything else valid, rebuild, repeat the import -- expected and confirmed: throws the length error naming the actual length received
- Restore `.env` to its original contents afterward and rebuild once more to leave the working tree clean

**Manual checks (if no CLI):**
- Confirm `.env.example` has no real secrets, only placeholders/instructions pointing to the setup guide
- Confirm `keystatic.config.ts` has no `allowedUsers` field and no other implication of a per-user allowlist
- Confirm `public/robots.txt` lists both new disallow rules
- Confirm `docs/KEYSTATIC_GITHUB_APP_SETUP.md` no longer claims `allowedUsers` restricts access, and that its Production-only env var scoping doesn't contradict the Preview-deployment limitation section

## Suggested Review Order

**Access control (the core of this story, and where the two review loops landed)**

- Entry point: the whole storage-branching decision, and why there's no allowlist field.
  [`keystatic.config.ts:6`](../../keystatic.config.ts#L6)

- Confirms the env-var source choice matches Keystatic's own handler exactly, after getting it backwards once mid-review.
  [`keystatic.config.ts:20`](../../keystatic.config.ts#L20)

- The fail-fast guard itself -- missing vars, then the `KEYSTATIC_SECRET` length floor.
  [`keystatic.config.ts:61`](../../keystatic.config.ts#L61)

- Repo string validation, including the character-class check added after edge-case review.
  [`keystatic.config.ts:48`](../../keystatic.config.ts#L48)

**Integration wiring**

- Where Keystatic and its React UI actually mount onto the site.
  [`astro.config.mjs:13`](../../astro.config.mjs#L13)

- Env var typing for the one client-visible Keystatic var.
  [`src/env.d.ts:4`](../../src/env.d.ts#L4)

**Crawlability**

- Keeps the admin shell out of search results now that any GitHub user can technically reach it.
  [`robots.txt:4`](../../public/robots.txt#L4)

**Documentation (the operational contract for whoever sets this up)**

- Full setup guide -- read the "Access model" section first, it's the part that changed most.
  [`KEYSTATIC_GITHUB_APP_SETUP.md:7`](../../docs/KEYSTATIC_GITHUB_APP_SETUP.md#L7)

- Env var placeholders and the corrected local-testing note (astro preview doesn't work here).
  [`.env.example:5`](../../.env.example#L5)

**Peripherals**

- New dependencies (Keystatic, React, their types).
  [`package.json:17`](../../package.json#L17)

- Corrected the same stale `allowedUsers` claim in the pre-existing architecture doc.
  [`ui-architecture.md:643`](../../docs/ui-architecture.md#L643)

- Same correction, Spanish project brief (3 spots).
  [`Project brief.md:109`](../../docs/Project%20brief.md#L109)

- Same correction, one line in the roadmap.
  [`development-roadmap.md:1357`](../../docs/development-roadmap.md#L1357)

- Same correction in the epic backlog and its cached context, so future stories in this epic don't inherit the wrong claim.
  [`epics.md:91`](../../_bmad-output/planning-artifacts/epics.md#L91)

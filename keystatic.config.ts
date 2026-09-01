/// <reference types="astro/client" />
/// <reference path="./src/env.d.ts" />

import { config } from '@keystatic/core';

/**
 * Access control note (Story 1.1):
 * There is no `allowedUsers`-style allowlist field anywhere in `@keystatic/core`.
 * This was confirmed absent from `GitHubStorageConfig` across every published
 * version at the time of writing (0.5.51, the version this project pins, through
 * the then-latest 0.6.9) -- it's a design characteristic of the library, not
 * something a future patch/minor bump within the `^0.5.51` range is expected to add.
 * The real production access boundary is GitHub's own repo-collaborator permission:
 * Keystatic's GitHub storage mode writes content using the authenticated user's own
 * OAuth token, so GitHub itself rejects write API calls from anyone who isn't a
 * collaborator with write access on the configured repo.
 * See docs/KEYSTATIC_GITHUB_APP_SETUP.md for the full explanation.
 */

/**
 * Env vars required to run Keystatic's `github` storage mode in production. These are
 * intentionally NOT read from here directly by `@keystatic/core`/`@keystatic/astro` --
 * they're read by Keystatic's own server-only API handler, not passed through this
 * config object. We still assert their presence here so misconfiguration fails loudly
 * and clearly at the edge, instead of surfacing as an opaque error deep inside
 * Keystatic's internals.
 *
 * Read via `import.meta.env`, not `process.env` -- confirmed by reading
 * `@keystatic/astro`'s actual handler source (`dist/keystatic-astro-api.js`): it
 * resolves `clientId`/`clientSecret`/`secret` via `import.meta.env.KEYSTATIC_*`, which
 * Vite statically bakes into the built server bundle at *build* time (verified by
 * inspecting this project's own compiled output). An earlier version of this guard
 * checked `process.env` instead, reasoning that would avoid a stale-snapshot drift --
 * that reasoning was wrong: it made the guard disagree with what Keystatic's handler
 * actually uses, which is the frozen `import.meta.env` value either way. Matching
 * Keystatic's own read mechanism exactly is what keeps the two from ever disagreeing;
 * the residual risk (a var changed in Vercel without a fresh deploy won't take effect
 * until the next build) is inherent to Keystatic's own design, not something this
 * guard can fix by reading differently.
 */
const REQUIRED_PROD_ENV_VARS = [
  'KEYSTATIC_GITHUB_CLIENT_ID',
  'KEYSTATIC_GITHUB_CLIENT_SECRET',
  'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  'KEYSTATIC_SECRET',
] as const;

function parseRepoConfig(raw: string | undefined): { owner: string; name: string } {
  if (!raw) {
    throw new Error(
      'keystatic.config.ts: PUBLIC_KEYSTATIC_GITHUB_REPO is not set. ' +
        'Expected "owner/name" (e.g. "Markuson/refusdignos"). ' +
        'See docs/KEYSTATIC_GITHUB_APP_SETUP.md.',
    );
  }
  const [owner, name, ...rest] = raw.split('/');
  const validSegment = /^[\w.-]+$/;
  if (!owner || !name || rest.length > 0 || !validSegment.test(owner) || !validSegment.test(name)) {
    throw new Error(
      `keystatic.config.ts: PUBLIC_KEYSTATIC_GITHUB_REPO must be in "owner/name" format, got ${JSON.stringify(raw)}.`,
    );
  }
  return { owner, name };
}

/**
 * Asserts the GitHub-mode secrets are present -- but only when evaluated on the
 * server. This module is imported both by Keystatic's server-only API route AND by
 * its `client:only="react"` admin UI, which Vite bundles separately for the browser.
 * `import.meta.env.SSR` is a build-time constant that's statically false in the
 * client bundle, so this whole branch is dead-code-eliminated from it -- it never
 * runs client-side, and every var it reads is already frozen into the server bundle
 * at build time regardless (see the constant above), so there's no client/server
 * env-source mismatch to worry about here, unlike an earlier version of this guard.
 */
function assertProdServerEnv(): void {
  if (!import.meta.env.SSR) return;

  const missing = REQUIRED_PROD_ENV_VARS.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `keystatic.config.ts: missing required environment variable(s) for GitHub storage mode: ${missing.join(', ')}. ` +
        'See docs/KEYSTATIC_GITHUB_APP_SETUP.md for setup instructions.',
    );
  }

  // @keystatic/core enforces this same minimum internally at request time; checking
  // it here too means a too-short secret fails at the same clear edge as a missing
  // one, instead of surfacing later from inside Keystatic's own code.
  const secret = import.meta.env.KEYSTATIC_SECRET;
  if (secret && secret.length < 32) {
    throw new Error(
      `keystatic.config.ts: KEYSTATIC_SECRET must be at least 32 characters long (got ${secret.length}). ` +
        'See docs/KEYSTATIC_GITHUB_APP_SETUP.md for setup instructions.',
    );
  }
}

const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : (() => {
      assertProdServerEnv();
      return {
        kind: 'github' as const,
        repo: parseRepoConfig(import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO),
      };
    })();

export default config({
  storage,
  // No collections/singletons yet -- this story only mounts the admin shell.
  // Story 1.2 adds the `refugios` collection.
});

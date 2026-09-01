# Keystatic GitHub App Setup

This guide covers the one-time setup needed for the production `/keystatic` admin
panel (Story 1.1) to write content to this repo via a GitHub App. **None of this is
needed for local development** -- `astro dev` always runs Keystatic in `local`
storage mode (no auth, writes straight to your working copy).

## Access model: GitHub collaborator permission, not an allowlist

`@keystatic/core`'s GitHub storage mode has **no `allowedUsers`, allowlist, or
equivalent per-user access-control field** -- this was checked across every published
version from `0.5.51` through the current `0.6.9` and confirmed absent from the
library's `GitHubStorageConfig` type. It does not exist, and nothing in this repo's
`keystatic.config.ts` claims otherwise.

The real production access boundary is **GitHub's own repo-collaborator permission**:

- Keystatic's GitHub storage mode signs users in via GitHub OAuth and then makes
  content-write API calls to GitHub **using that user's own OAuth token**.
- GitHub itself enforces write permission on `Markuson/refusdignos`. Any GitHub
  account can complete the OAuth login and the `/keystatic` admin shell may load for
  them, but only accounts with collaborator write access on the repo can successfully
  save an edit -- everyone else's save/write calls are rejected by GitHub's own API,
  not by anything in this codebase.
- This means the client should only be added as a GitHub collaborator on
  `Markuson/refusdignos` once they're actually ready to start editing content
  (Story 1.4) -- not before. Until then, the admin UI being reachable by any
  authenticated GitHub user is expected and is not a bug: it simply can't be used to
  change anything without write access.

If stronger gating than "any authenticated GitHub user can view the shell, only
collaborators can save" is ever required, it would need to be built as custom
middleware in front of Keystatic's routes -- this was considered for Story 1.1 and
explicitly rejected in favor of relying on GitHub's native permission model.

## 1. Create the GitHub App

1. Go to **GitHub Settings → Developer settings → GitHub Apps → New GitHub App**
   (for a personal-account-owned app: <https://github.com/settings/apps/new>).
2. Fill in:
   - **GitHub App name**: anything recognizable, e.g. `refusdignos-keystatic`.
   - **Homepage URL**: the production site URL, e.g.
     `https://refugioslibresdignos.com`.
   - **Callback URL**: `https://refugioslibresdignos.com/api/keystatic/github/oauth/callback`
     (add more callback URLs for any other environment that needs to complete OAuth --
     see the local-testing and Preview-deployment sections below).
   - **Webhook**: uncheck "Active" -- not used by Keystatic.
   - **Permissions → Repository permissions**:
     - `Contents`: Read and write
     - `Metadata`: Read-only (mandatory, auto-selected)
   - **Where can this GitHub App be installed?**: "Only on this account" is fine
     unless you need it elsewhere.
3. Create the app, then generate a **client secret** on the app's settings page.
   Note down: the **Client ID**, the **Client secret**, and the app's **slug**
   (the part of the app's URL after `github.com/apps/`).
4. **Install** the app on the `Markuson/refusdignos` repository. This is done from
   the **GitHub App's own settings page** (`github.com/settings/apps/<your-app-slug>`),
   **not** the repository's settings:
   - In the left sidebar of the app's settings page, click **"Install App"**.
   - Click the green **Install** button next to your account.
   - Choose **"Only select repositories"** and pick `refusdignos`, then confirm.

## 2. Environment variables

Set these in Vercel's project environment variables, scoped to **Production only**
(not Preview -- see the Preview-deployment limitation in section 4 below; setting
these on Preview too won't help without also registering a matching callback URL per
Preview URL). Placeholders and format live in `.env.example` at the repo root --
**never commit real values**.

| Variable | Value |
|---|---|
| `PUBLIC_KEYSTATIC_GITHUB_REPO` | `Markuson/refusdignos` (not a secret) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Client ID from the app's settings page |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Client secret you generated |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The app's slug (used by the admin UI to build the GitHub install link) |
| `KEYSTATIC_SECRET` | Any random string, **minimum 32 characters** (enforced both by `keystatic.config.ts` and, redundantly, by `@keystatic/core` itself at runtime -- it encrypts the session cookie). Generate one with `openssl rand -hex 32`. |

If any of `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
`PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, or `KEYSTATIC_SECRET` is missing (or
`KEYSTATIC_SECRET` is too short) in a production build, `keystatic.config.ts` throws
a clear error at request time naming exactly what's wrong, rather than failing
opaquely inside Keystatic's own code.

**If you ever rotate `KEYSTATIC_SECRET`,** every already-signed-in editor's session
cookie (encrypted with the old secret) becomes unreadable and they're silently logged
out -- expected, not a bug, but worth knowing before you wonder why editing suddenly
stopped working for someone.

## 3. Testing GitHub storage mode locally

**`pnpm dev` cannot be used to test `github` storage mode.** `astro dev` always sets
`import.meta.env.DEV = true`, and `keystatic.config.ts` branches on that flag to force
`local` storage mode in dev, full stop -- setting the GitHub env vars in your local
`.env` while running `pnpm dev` has no effect.

**`pnpm build && pnpm preview` does not work for this either.** This project uses the
`@astrojs/vercel` adapter, which does not support Astro's built-in `preview` command at
all (`astro preview` errors immediately: "The @astrojs/vercel adapter does not support
the preview command") -- confirmed by actually running it. There is no local way to
serve the on-demand `/keystatic` and `/api/keystatic` routes exactly as Vercel would
run them without the [Vercel CLI](https://vercel.com/docs/cli)'s `vercel dev` (requires
installing `vercel` and linking the project; not covered here).

In practice, the realistic way to test `github` storage mode is on an actual Vercel
deployment (production, or a Preview deployment once its own callback URL is
registered -- see the limitation below), not locally.

## 4. Known limitation: Vercel Preview deployments

Vercel Preview deployments get a fresh, unique URL per PR/branch. Since GitHub Apps
require callback URLs to be registered up front, OAuth will not complete on a Preview
deployment's URL unless that exact URL is added as a callback URL on the app first.
This is not solved here -- it's a known characteristic to be aware of, not a defect in
this story's implementation. If Preview-deployment editing is ever needed, it would
require either a wildcard/proxy callback strategy or registering each Preview URL
manually, both out of scope for now.

## 5. Verifying access control (manual, needs a real GitHub App + a second account)

This cannot be verified without the real GitHub App and a second GitHub account, so
it's documented here as a manual follow-up rather than an automated check in this
story:

- **Collaborator path**: a GitHub account with write access on `Markuson/refusdignos`
  completes OAuth, lands back in the admin panel, and can save changes.
- **Non-collaborator path**: a GitHub account without write access on the repo can
  complete OAuth and the admin UI may still load, but any save/write attempt is
  rejected by GitHub's own permission check -- this is expected, not a bug.

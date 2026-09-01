/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /**
   * "owner/name" of the GitHub repo Keystatic writes to in production (`github`
   * storage mode). Public because it's non-sensitive and read on both the server
   * and the client-only admin UI. See docs/KEYSTATIC_GITHUB_APP_SETUP.md.
   */
  readonly PUBLIC_KEYSTATIC_GITHUB_REPO: string;
  /** GitHub App slug, e.g. "refusdignos-keystatic". Public: read by the admin UI. */
  readonly PUBLIC_KEYSTATIC_GITHUB_APP_SLUG?: string;
  /** Server-only secrets for Keystatic's GitHub OAuth flow -- see keystatic.config.ts. */
  readonly KEYSTATIC_GITHUB_CLIENT_ID?: string;
  readonly KEYSTATIC_GITHUB_CLIENT_SECRET?: string;
  readonly KEYSTATIC_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

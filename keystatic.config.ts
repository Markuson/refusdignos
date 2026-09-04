/// <reference types="astro/client" />
/// <reference path="./src/env.d.ts" />

import { collection, config, fields, singleton } from '@keystatic/core';
import { cloudinaryField } from './src/components/admin/cloudinary-field';
import { logoField } from './src/components/admin/logo-field';

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

/**
 * Story 1.2: refugios collection, scoped to the 9 editable text fields from
 * `src/content/config.ts`'s Zod schema, plus (Story 1.3) `imagenes` via the
 * hand-built `cloudinaryField`. `localizacion` and `ogImage` stay declared as
 * `fields.ignored()` -- NOT omitted -- because `@keystatic/core@0.5.51`'s
 * `parseEntry`/`serializeEntryToFiles` drop any frontmatter key absent from
 * the schema on save. Omitting them would silently destroy any future
 * ogImage/localizacion value on first edit. `fields.ignored()` round-trips
 * the on-disk value untouched and renders no input, so these stay invisible
 * to the editor. Both are confirmed unused across all 17 refugio files and
 * have no rendering-surface wiring, so leaving them ignored is safe.
 *
 * `fechaPublicacion` gets the same `fields.ignored()` treatment for the same
 * reason: it's not in the Zod schema (Zod silently strips unknown keys, so its
 * absence there is harmless), but it IS present in `es-plans.md`'s frontmatter
 * -- the only one of the 17 files with this extra key (confirmed by grepping
 * all top-level frontmatter keys across every refugio file). Without declaring
 * it, saving that one entry through the admin panel would silently delete it.
 *
 * Image uploads (Cloudinary): `imagenes` is `fields.array` of
 * `{ publicId, alt }` objects. `publicId` is the custom `cloudinaryField`
 * (unsigned browser→Cloudinary upload, stores a bare `public_id` string --
 * `fields.custom()` does not exist at this `@keystatic/core` version, so this
 * is a hand-built `BasicFormField`, see `src/components/admin/cloudinary-field.tsx`).
 * The array's `validation.length.min: 1` blocks saving an entry with zero
 * images, matching `src/content/config.ts`'s `.min(1)` Zod constraint.
 */
export default config({
  storage,
  collections: {
    refugios: collection({
      label: 'Refugios',
      path: 'src/content/refugios/*',
      // `title` is the slug field so the filename stays independent of the
      // display title, matching existing files (e.g. `bonicaparra.md` vs.
      // `title: "Refugio Bonicaparra"`). Must be `fields.slug()`, not
      // `fields.text()` -- a plain text field throws `"slugField is not a slug
      // field"` at runtime. `serializeWithSlug` writes only `name` back to
      // frontmatter, never the slug, so `title` stays a flat string on disk.
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'form',
      schema: {
        title: fields.slug({
          name: {
            label: 'Título',
            description:
              'Al crear un refugio nuevo, añade al menos una foto (con su texto alternativo) en la sección "Imágenes" antes de guardar: sin ninguna foto, la web no podrá compilarse.',
            validation: { isRequired: true },
          },
          slug: {
            description:
              'No cambies esto en un refugio que ya existe: cambiará su dirección web pública y los enlaces antiguos dejarán de funcionar.',
          },
        }),
        ubicacion: fields.text({
          label: 'Ubicación',
          validation: { isRequired: true },
        }),
        altitud: fields.text({ label: 'Altitud' }),
        capacidad: fields.text({ label: 'Capacidad' }),
        descripcionCorta: fields.text({
          label: 'Descripción corta',
          multiline: true,
          validation: { isRequired: true },
        }),
        descripcionLarga: fields.text({
          label: 'Descripción larga',
          multiline: true,
          validation: { isRequired: true },
        }),
        brindadoA: fields.text({ label: 'Brindado a', multiline: true }),
        seoTitle: fields.text({ label: 'Título SEO' }),
        seoDescription: fields.text({ label: 'Descripción SEO', multiline: true }),
        imagenes: fields.array(
          fields.object({
            publicId: cloudinaryField({
              label: 'Imagen',
              folder: 'refugios',
              required: true,
            }),
            alt: fields.text({
              label: 'Texto alternativo',
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Imágenes',
            validation: { length: { min: 1 } },
          },
        ),
        // Preserved but out of scope for this story -- see block comment above.
        localizacion: fields.ignored(),
        ogImage: fields.ignored(),
        fechaPublicacion: fields.ignored(),
        // Unused in practice -- every existing entry has an empty body. This
        // field exists only so Keystatic derives `.md` output (via
        // `getDataFileExtension`); without a contentField it defaults to `.yaml`.
        // Declared last so it renders at the bottom of the form, not right
        // under the title where it reads as a mysterious empty rich-text box.
        content: fields.markdoc({
          label: 'Contenido (no utilizado)',
          extension: 'md',
        }),
      },
    }),
    /**
     * Story 2.1: colaboradores collection, matching
     * `src/content/colaboradores/*.md` and `src/content/config.ts`'s
     * `colaboradoresCollection` Zod schema exactly (nombre, tipo,
     * descripcion, logo, url, orden). `nombre` is the slug field so the
     * filename stays independent of the display name, matching all 13
     * existing files (e.g. `bellota.md` has `nombre: "Bellota"`) -- same
     * `title`/slug independence pattern as `refugios.title` above.
     *
     * `logo` uses the hand-built `logoField` (dual-mode: URL text input OR
     * Cloudinary upload) instead of `cloudinaryField`, because -- unlike
     * refugio images -- existing colaborador logos are legitimately a mix of
     * external URLs and local `/logos/*.webp` paths; see
     * `src/components/admin/logo-field.tsx` for the full rationale.
     *
     * `content` gets the same empty-body `fields.markdoc` treatment as
     * `refugios.content` above, purely so Keystatic derives `.md` output
     * instead of defaulting to `.yaml` -- every existing colaborador file
     * has an empty body.
     */
    colaboradores: collection({
      label: 'Colaboradores',
      path: 'src/content/colaboradores/*',
      slugField: 'nombre',
      format: { contentField: 'content' },
      entryLayout: 'form',
      schema: {
        nombre: fields.slug({
          name: {
            label: 'Nombre',
            validation: { isRequired: true },
          },
          slug: {
            description:
              'No cambies esto en un colaborador que ya existe: cambiará el nombre de su archivo.',
          },
        }),
        categoria: fields.select({
          label: 'Categoría',
          description:
            'Determina si aparece en la sección "Patrocinadores" o "Colaboradores" de la página pública.',
          options: [
            { label: 'Colaborador', value: 'colaborador' },
            { label: 'Patrocinador', value: 'patrocinador' },
          ],
          defaultValue: 'colaborador',
        }),
        tipo: fields.text({
          label: 'Tipo',
          description:
            'Descripción breve de qué aporta (ej.: "Herramientas", "Aceites de oliva"). Se muestra en la tarjeta de Colaborador; no afecta a la sección en la que aparece (usa "Categoría" para eso).',
          validation: { isRequired: true },
        }),
        descripcion: fields.text({
          label: 'Descripción',
          multiline: true,
          validation: { isRequired: true },
        }),
        logo: logoField({
          label: 'Logo',
          description:
            'Usa una URL externa si el logo ya está alojado en otro sitio, o sube un archivo nuevo a Cloudinary.',
          folder: 'colaboradores',
          required: true,
        }),
        url: fields.url({
          label: 'URL',
          description: 'Enlace al sitio web o red social del colaborador.',
          validation: { isRequired: true },
        }),
        orden: fields.integer({
          label: 'Orden',
          description: 'Orden de aparición dentro de su sección (menor primero). Opcional.',
        }),
        // Unused in practice -- every existing entry has an empty body. Same
        // reasoning as `refugios.content` above: exists only so Keystatic
        // derives `.md` output via `getDataFileExtension`.
        content: fields.markdoc({
          label: 'Contenido (no utilizado)',
          extension: 'md',
        }),
      },
    }),
  },
  /**
   * Story 2.2: three singletons -- `globalSettings`, `homePage`, `contactoPage`
   * -- mirroring the proven pattern from the sibling `ivocorr` project. Each is
   * `singleton({ path, format: { data: 'json' }, schema })`, stored as a plain
   * `src/content/<kebab-name>/index.json` file, and consumed by its 4 page/
   * component files via a direct static `import` (not Astro Content
   * Collections -- `ivocorr`'s equivalent Content Layer schema for this exists
   * only in a stale comment; every real consumer there bypasses it with a
   * plain JSON import, which is what this project follows). Deliberately NOT
   * added to `src/content/config.ts`.
   *
   * `globalSettings` consolidates contact email, social links, and bank
   * details that were previously duplicated across `constants.ts`,
   * `Footer.astro`, `BankDetails.astro`, and `contacto.astro`.
   */
  singletons: {
    globalSettings: singleton({
      label: 'Configuración Global',
      path: 'src/content/global-settings/',
      format: { data: 'json' },
      schema: {
        contactEmail: fields.text({
          label: 'Email de contacto',
          validation: { isRequired: true },
        }),
        instagramUrl: fields.text({
          label: 'URL de Instagram',
          validation: { isRequired: true },
        }),
        facebookUrl: fields.text({
          label: 'URL de Facebook',
          validation: { isRequired: true },
        }),
        tiktokUrl: fields.text({
          label: 'URL de TikTok',
          validation: { isRequired: true },
        }),
        bankAccountHolder: fields.text({
          label: 'Titular de la cuenta bancaria',
          validation: { isRequired: true },
        }),
        bankName: fields.text({
          label: 'Nombre del banco',
          validation: { isRequired: true },
        }),
        bankIban: fields.text({
          label: 'IBAN',
          validation: { isRequired: true },
        }),
        bankBic: fields.text({
          label: 'BIC/SWIFT',
          validation: { isRequired: true },
        }),
      },
    }),
    homePage: singleton({
      label: 'Página de Inicio',
      path: 'src/content/home-page/',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({
          label: 'Título principal',
          validation: { isRequired: true },
        }),
        heroSubtitle: fields.text({
          label: 'Subtítulo principal',
          multiline: true,
          validation: { isRequired: true },
        }),
        heroCtaLabel: fields.text({
          label: 'Texto del botón principal',
          validation: { isRequired: true },
        }),
        missionTitle: fields.text({
          label: 'Título de la sección Nuestro Proyecto',
          validation: { isRequired: true },
        }),
        missionParagraph1: fields.text({
          label: 'Nuestro Proyecto - Párrafo 1',
          multiline: true,
          validation: { isRequired: true },
        }),
        missionParagraph2: fields.text({
          label: 'Nuestro Proyecto - Párrafo 2',
          multiline: true,
          validation: { isRequired: true },
        }),
        missionCtaLabel: fields.text({
          label: 'Texto del botón Nuestro Proyecto',
          validation: { isRequired: true },
        }),
        featuredRefugiosTitle: fields.text({
          label: 'Título de la sección Refugios Destacados',
          validation: { isRequired: true },
        }),
      },
    }),
    contactoPage: singleton({
      label: 'Página de Contacto',
      path: 'src/content/contacto-page/',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({
          label: 'Título principal',
          validation: { isRequired: true },
        }),
        heroSubtitle: fields.text({
          label: 'Subtítulo principal',
          validation: { isRequired: true },
        }),
        infoSectionTitle: fields.text({
          label: 'Título de la sección de información',
          validation: { isRequired: true },
        }),
        infoSectionText: fields.text({
          label: 'Texto de la sección de información',
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
});

#!/usr/bin/env node
/**
 * migrate-refugio-images-to-cloudinary.mjs
 *
 * One-off migration script for Story 1.3. Uploads every existing refugio
 * image (currently git-committed under `src/assets/refugios/<slug-variant>/`)
 * to Cloudinary via the SAME unsigned upload endpoint/preset the browser
 * `cloudinaryField` uses (plain `fetch`, no SDK), then rewrites each
 * refugio's `.md` frontmatter `imagenes` list from `{src, alt}` (a relative
 * path to a local asset) to `{publicId, alt}` (a bare Cloudinary public_id),
 * preserving the existing `alt` text exactly.
 *
 * This MUST run before (or alongside) the `src/content/config.ts` /
 * `keystatic.config.ts` schema change lands, so no refugio is ever left with
 * a schema-invalid or empty `imagenes` array.
 *
 * Usage:
 *   node scripts/migrate-refugio-images-to-cloudinary.mjs           # run for real
 *   node scripts/migrate-refugio-images-to-cloudinary.mjs --dry-run # preview only, no uploads/writes
 *
 * Requires PUBLIC_CLOUDINARY_CLOUD_NAME and PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * to be set (in the environment, or in a `.env` file at the repo root).
 *
 * Uploads go to Cloudinary folder `refugios/<slug>` (one subfolder per
 * refugio, keyed by the `.md` filename's slug) -- this keeps the migrated
 * images organized by refugio, distinct from the flat `refugios` folder new
 * uploads land in via the Keystatic field (which has no per-entry folder
 * context available to it).
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const REFUGIOS_DIR = path.join(REPO_ROOT, 'src/content/refugios');

const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Minimal .env loader (no dependency on `dotenv`) -- only used to populate
// process.env for local runs; real deployments already have these set.
// ---------------------------------------------------------------------------
async function loadDotEnv() {
  const envPath = path.join(REPO_ROOT, '.env');
  let contents;
  try {
    contents = await readFile(envPath, 'utf8');
  } catch {
    return;
  }
  for (const rawLine of contents.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

// ---------------------------------------------------------------------------
// Frontmatter helpers
//
// Every refugio `.md` file has a uniform, hand-authored `imagenes:` block
// (verified across all 17 files before writing this script):
//
//   imagenes:
//     - src: ../../assets/refugios/<folder>/<file>
//       alt: "<text>"
//     - src: ...
//       alt: "..."
//
// Rather than pull in a YAML parser/serializer (which would reformat the
// entire frontmatter -- multiline `descripcionLarga: |` blocks included --
// and risk corrupting unrelated fields), this script surgically replaces
// only the `imagenes:` block via targeted regex/string manipulation, leaving
// every other byte of the file untouched.
// ---------------------------------------------------------------------------

const IMAGENES_BLOCK_RE = /^imagenes:\n((?:  - src: .*\n(?:    alt: .*\n))+)/m;
// Deliberately no `$`/`m` anchors on either line: with the `m` flag, `$`
// asserts before a `\n` OR at end-of-string -- but the position right after
// this entry's own trailing `\n` is the *start* of the next entry's `  - src`
// line, not "before a newline", so an anchored version of this regex only
// ever matches the final entry in a multi-image block. Matching the two
// lines by content alone (no `$`) lets `g` advance correctly through every
// entry.
const IMAGE_ENTRY_RE = /  - src: (.*)\n {4}alt: (.*)\n/g;

function parseImagenesBlock(blockBody) {
  const entries = [];
  let match;
  IMAGE_ENTRY_RE.lastIndex = 0;
  while ((match = IMAGE_ENTRY_RE.exec(blockBody)) !== null) {
    entries.push({ src: match[1].trim(), alt: match[2] });
  }
  return entries;
}

function buildImagenesBlock(entries) {
  const lines = ['imagenes:'];
  for (const { publicId, alt } of entries) {
    lines.push(`  - publicId: "${publicId}"`);
    lines.push(`    alt: ${alt}`);
  }
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Cloudinary unsigned upload -- same endpoint/preset as cloudinary-field.tsx
// ---------------------------------------------------------------------------
async function uploadToCloudinary({ cloudName, uploadPreset, folder, filePath }) {
  const fileBuffer = await readFile(filePath);
  const filename = path.basename(filePath);

  const form = new FormData();
  form.append('file', new Blob([fileBuffer]), filename);
  form.append('upload_preset', uploadPreset);
  form.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const body = await res.json();
  if (!res.ok) {
    const message = body?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(`Cloudinary upload failed for ${filePath}: ${message}`);
  }
  if (!body.public_id) {
    throw new Error(`Cloudinary upload for ${filePath} returned no public_id.`);
  }
  return body.public_id;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  await loadDotEnv();

  const cloudName = process.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!DRY_RUN && (!cloudName || !uploadPreset)) {
    console.error(
      'Missing PUBLIC_CLOUDINARY_CLOUD_NAME and/or PUBLIC_CLOUDINARY_UPLOAD_PRESET.\n' +
        'Set them in the environment or in a .env file at the repo root.',
    );
    process.exit(1);
  }

  const files = (await readdir(REFUGIOS_DIR)).filter((f) => f.endsWith('.md')).sort();

  console.log(`Found ${files.length} refugio file(s) in ${path.relative(REPO_ROOT, REFUGIOS_DIR)}`);
  if (DRY_RUN) console.log('--dry-run: no uploads or file writes will be performed.\n');

  let totalUploaded = 0;
  let totalRewritten = 0;
  const failures = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const filePath = path.join(REFUGIOS_DIR, file);
    const original = await readFile(filePath, 'utf8');

    const blockMatch = original.match(IMAGENES_BLOCK_RE);
    if (!blockMatch) {
      failures.push(`${file}: could not locate an 'imagenes:' block matching the expected shape.`);
      continue;
    }

    const entries = parseImagenesBlock(blockMatch[1]);
    if (entries.length === 0) {
      failures.push(`${file}: 'imagenes:' block matched but contained zero entries.`);
      continue;
    }

    console.log(`\n${file} (${entries.length} image${entries.length === 1 ? '' : 's'})`);

    const uploaded = [];
    let fileFailed = false;

    for (const entry of entries) {
      // entry.src is like "../../assets/refugios/<folder>/<name>.webp",
      // relative to src/content/refugios/<file>.
      const absoluteImagePath = path.resolve(path.dirname(filePath), entry.src);
      const relativeForLog = path.relative(REPO_ROOT, absoluteImagePath);

      if (DRY_RUN) {
        console.log(`  [dry-run] would upload ${relativeForLog} -> folder refugios/${slug}`);
        uploaded.push({ publicId: `refugios/${slug}/<dry-run>`, alt: entry.alt });
        continue;
      }

      try {
        const publicId = await uploadToCloudinary({
          cloudName,
          uploadPreset,
          folder: `refugios/${slug}`,
          filePath: absoluteImagePath,
        });
        console.log(`  uploaded ${relativeForLog} -> ${publicId}`);
        uploaded.push({ publicId, alt: entry.alt });
        totalUploaded += 1;
      } catch (err) {
        console.error(`  FAILED ${relativeForLog}: ${err.message}`);
        failures.push(`${file}: ${err.message}`);
        fileFailed = true;
        break;
      }
    }

    if (fileFailed) {
      console.error(`  Skipping frontmatter rewrite for ${file} due to upload failure(s) above.`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`  [dry-run] would rewrite 'imagenes:' block in ${file}.`);
      continue;
    }

    const newBlock = buildImagenesBlock(uploaded);
    const rewritten = original.replace(IMAGENES_BLOCK_RE, newBlock);

    if (rewritten === original) {
      failures.push(`${file}: rewrite produced no change (unexpected) -- left file untouched.`);
      continue;
    }

    await writeFile(filePath, rewritten, 'utf8');
    console.log(`  rewrote frontmatter in ${file}`);
    totalRewritten += 1;
  }

  console.log('\n--- Summary ---');
  console.log(`Files processed:   ${files.length}`);
  console.log(`Images uploaded:   ${totalUploaded}`);
  console.log(`Files rewritten:   ${totalRewritten}`);
  if (failures.length > 0) {
    console.log(`Failures:          ${failures.length}`);
    for (const f of failures) console.log(`  - ${f}`);
    process.exitCode = 1;
  } else {
    console.log('Failures:          0');
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});

/**
 * Cloudinary URL builder (Story 1.3).
 *
 * Refugio images are stored as bare Cloudinary `public_id`s (see
 * `src/content/config.ts`'s `cloudinaryId` schema and
 * `src/components/admin/cloudinary-field.tsx`, which is what writes them).
 * The three public rendering surfaces (`src/pages/refugios/[slug].astro`,
 * `src/pages/refugios/index.astro`, `src/pages/index.astro`) all need to
 * turn a `public_id` into a real image URL at render time -- this is the one
 * place that happens, so the URL shape only needs to be right once.
 *
 * `PUBLIC_CLOUDINARY_CLOUD_NAME` is required at build time: if it's missing,
 * every refugio image on the site would silently 404, so this throws instead
 * of returning a broken URL.
 */
export function buildCloudinaryUrl(publicId: string, transforms = 'f_auto,q_auto'): string {
  const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error(
      'PUBLIC_CLOUDINARY_CLOUD_NAME is not set -- required to build refugio image URLs. See .env.example.',
    );
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}

/**
 * Builds a `srcset` attribute value with one Cloudinary width-transform URL
 * per entry in `widths`, so the browser can pick the right one instead of
 * every viewport downloading the same fixed-width image. Each rendering
 * surface pairs this with a `sizes` attribute matching its own layout (the
 * same numbers the old `astro:assets <Image widths={[...]} sizes="...">`
 * calls used, before Story 1.3 swapped to Cloudinary URLs).
 */
export function buildCloudinarySrcSet(publicId: string, widths: number[]): string {
  return widths.map((w) => `${buildCloudinaryUrl(publicId, `w_${w},f_auto,q_auto`)} ${w}w`).join(', ');
}

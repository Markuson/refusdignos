// Content Collections Configuration for RefugiosLibresDignos
import { defineCollection, z } from 'astro:content';

// Story 1.3: a Cloudinary `public_id`, never a full URL. `cloudinaryField`
// (src/components/admin/cloudinary-field.tsx) stores exactly this shape when
// an editor uploads via Keystatic; the migration script
// (scripts/migrate-refugio-images-to-cloudinary.mjs) rewrites every existing
// refugio's `imagenes` frontmatter to match before this schema goes live, so
// no refugio is ever left with an invalid/missing `publicId`. Rejecting a
// value that looks like a URL isn't guarding against anything an editor can
// do through the Keystatic UI -- `cloudinaryField` is a file picker with no
// free-text input, so there's no path for someone to paste a URL through it.
// It guards against someone hand-editing a refugio's `.md` frontmatter
// directly (or a future migration/import script) and putting a full
// Cloudinary/asset URL in `publicId` by mistake instead of a bare id.
const cloudinaryId = z
  .string()
  .min(1)
  .refine((v) => !v.startsWith('http'), {
    message: 'Debe ser un public_id de Cloudinary, no una URL completa.',
  });

const refugiosCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // Basic Information
    title: z.string(),
    // Note: slug is automatically generated from the file name, don't include in frontmatter
    ubicacion: z.string(),
    altitud: z.string().optional(),
    capacidad: z.string().optional(),

    // Descriptions
    descripcionCorta: z.string(),
    descripcionLarga: z.string(),

    // Community dedication (optional - only for refugios that have been brindados to associations)
    brindadoA: z.string().optional(),

    // Images - Cloudinary public_id + alt text; at least one image required.
    // See `cloudinaryId` above for why `image()` (Astro's local-asset helper)
    // is no longer used here.
    imagenes: z
      .array(
        z.object({
          publicId: cloudinaryId,
          alt: z.string(),
        }),
      )
      .min(1),

    // Optional geolocation (for future map feature in Iteration III)
    localizacion: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    // Untouched this story -- Zod shape stays exactly as before. Confirmed
    // zero usage across all 17 refugio files and no rendering-surface wiring
    // (Story 1.3 scope note).
    ogImage: image().optional(),
  }),
});

const colaboradoresCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    nombre: z.string(),
    // Drives the Patrocinadores/Colaboradores split on `/colaboradores`.
    // Separate from `tipo` below: `categoria` is the fixed classification,
    // `tipo` stays a free-text descriptive label (e.g. "Herramientas") shown
    // only on colaborador cards. Files without `categoria` (pre-Story-2.1)
    // default to 'colaborador', matching the Keystatic field's default.
    categoria: z.enum(['colaborador', 'patrocinador']).default('colaborador'),
    tipo: z.string(),
    descripcion: z.string(),
    logo: z.string(), // Can be external URL or local path
    url: z.string().url(),
    orden: z.number().optional(), // Optional display order
  }),
});

export const collections = {
  refugios: refugiosCollection,
  colaboradores: colaboradoresCollection,
};

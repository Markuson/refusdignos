// Content Collections Configuration for RefugiosLibresDignos
import { defineCollection, z } from 'astro:content';

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

    // Images - using Astro's image() helper for type-safe images
    imagenes: z.array(z.object({
      src: image(),
      alt: z.string(),
    })),

    // Optional geolocation (for future map feature in Iteration III)
    localizacion: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),

    // SEO
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: image().optional(),
  }),
});

const colaboradoresCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    nombre: z.string(),
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

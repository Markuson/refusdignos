// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://refugioslibresdignos.com',
  adapter: vercel(),
  integrations: [sitemap(), react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
# RefugiosLibresDignos

**Espacios seguros, libres y dignos en los Pirineos**

A non-profit website for an organization dedicated to rehabilitating abandoned mountain refuges in the Pyrenees, providing safe, free, and dignified spaces for all hikers.

**Live site:** [refugioslibresdignos.com](https://refugioslibresdignos.com)

## Tech Stack

- **Framework:** [Astro 5.x](https://astro.build) (Static Site Generation)
- **Styling:** [Tailwind CSS 4.x](https://tailwindcss.com)
- **Language:** TypeScript
- **Deployment:** [Vercel](https://vercel.com)
- **Package Manager:** pnpm

## Quick Start

```bash
pnpm install
cp .env.example .env   # Add your Web3Forms API key
pnpm dev               # http://localhost:4321
```

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build production site |
| `pnpm preview` | Preview production build |
| `pnpm check` | Run TypeScript type checking |

## Deployment

Automatic deployment to Vercel:

- **Production:** Push to `main`
- **Preview:** Push to `dev`

## Roadmap

### Iteration I - MVP (Complete)
Static website with all core pages, refuge showcase with image galleries, contact form, collaborators section, and SEO/accessibility optimization.

### Iteration II - Membership (In Progress)
Basic membership system ("Hazte Socio") with bank transfer support. Future improvements will add online donations and subscription payments.

## Documentation

See [docs/TECHNICAL.md](docs/TECHNICAL.md) for detailed project structure, design system, architecture, and content management.

## License

Copyright 2025 RefugiosLibresDignos. All rights reserved.

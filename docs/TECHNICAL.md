# Technical Documentation

Detailed technical reference for the RefugiosLibresDignos project.

## Project Structure

```
refusdignos/
├── docs/                    # Project documentation
├── public/                  # Static assets
│   ├── fonts/              # Inter font files
│   ├── logos/              # Collaborator logos
│   └── logo.webp           # Site logo
├── src/
│   ├── assets/             # Optimized images
│   │   ├── images/         # General images (hero, about)
│   │   ├── refugios/       # Refuge photos (by name)
│   │   └── icons/          # SVG social icons
│   ├── components/         # Reusable Astro components
│   │   ├── Navbar.astro    # Responsive nav with glass effect
│   │   ├── Footer.astro    # Site footer with social links
│   │   └── BankDetails.astro # Bank info card with copy-to-clipboard
│   ├── config/             # App constants
│   │   └── constants.ts    # Contact email, API keys
│   ├── content/            # Content collections (Markdown)
│   │   ├── refugios/       # 8 refuge entries
│   │   ├── colaboradores/  # 9 collaborator entries
│   │   └── config.ts       # Collection schemas
│   ├── layouts/
│   │   └── BaseLayout.astro # Main layout (SEO, OG, JSON-LD)
│   ├── pages/              # File-based routing
│   │   ├── index.astro           # Homepage
│   │   ├── proyecto.astro        # Mission & values
│   │   ├── refugios/index.astro  # Refuge listing
│   │   ├── refugios/[slug].astro # Refuge detail (gallery, lightbox)
│   │   ├── unete.astro           # Membership & donations
│   │   ├── colaboradores.astro   # Partners showcase
│   │   ├── contacto.astro        # Contact form (Web3Forms)
│   │   └── legal/                # Privacy, terms, cookies
│   └── styles/
│       └── global.css      # Custom properties, button styles, animations
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero, mission, featured refugios carousel, sponsors, CTA |
| `/proyecto` | Proyecto | History, values, impact metrics |
| `/refugios` | Refugios | Grid listing of all rehabilitated refuges |
| `/refugios/:slug` | Refuge detail | Image gallery with lightbox, stats, description |
| `/unete` | Unete | Membership (20€/year), sponsorship info, donations |
| `/colaboradores` | Colaboradores | Partner companies and contributors grid |
| `/contacto` | Contacto | Contact form, social media links |
| `/legal/*` | Legal | Privacy policy, terms, cookies |

## Content Collections

Content is managed via Markdown files in `src/content/`.

### Refugios (`src/content/refugios/`)

```yaml
title: string
ubicacion: string
altitud?: string
capacidad?: string
descripcionCorta: string
descripcionLarga: string
brindadoA?: string            # Dedication to associations
imagenes: [{src: image, alt: string}]
localizacion?: {lat, lng}
```

### Colaboradores (`src/content/colaboradores/`)

```yaml
nombre: string
tipo: string
descripcion: string
logo: string
url: string
orden?: number
```

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Forest Green | `#284c3e` | Primary, text, headings |
| Sunrise Orange | `#E78A33` | Accent, CTAs, highlights |
| Meadow Green | `#648D21` | Secondary accent |
| Tan | `#D8C28E` | Subtle backgrounds |
| Background Light | `#f9f8f4` | Light sections |
| Background Dark | `#f7f4ef` | Dark sections |

### Typography

- **Font:** Inter (400, 600, 800)
- **Base size:** 18px (16px on mobile)

### Button Variants

- `.btn-primary` — Forest green, solid fill
- `.btn-secondary` — Sunrise orange, solid fill
- `.btn-outline` — Forest green border, transparent, fills on hover

## Key Features

- **Image optimization** via Sharp and Astro's `<Image>` component
- **View Transitions** for smooth page navigation
- **Responsive** mobile-first design with glass-effect navbar
- **Accessibility** — WCAG 2.1 AA, skip-to-content, keyboard navigation, aria attributes
- **SEO** — JSON-LD structured data, OpenGraph, sitemap, robots.txt
- **Contact form** via Web3Forms (requires `PUBLIC_WEB3FORMS_KEY` in `.env`)
- **Caching** — 1-year immutable cache for fonts, images, and static assets (via Vercel config)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_WEB3FORMS_KEY` | API key from [web3forms.com](https://web3forms.com) for the contact form |

## Performance Targets

- Lighthouse Performance: ≥95 (desktop), ≥90 (mobile)
- FCP: < 1.5s
- LCP: < 2.5s

## Legacy Documentation

- [Project Brief](Project%20brief.md)
- [PRD](prd.md)
- [UI Architecture](ui-architecture.md)
- [Front-End Spec](front-end-spec.md)
- [Development Roadmap](development-roadmap.md)

# RefugiosLibresDignos Frontend Architecture Document

**Version:** 1.0
**Date:** 2025-10-17
**Author:** Winston (Architect)
**Status:** Ready for Development

---

## Table of Contents

1. [Template and Framework Selection](#template-and-framework-selection)
2. [Frontend Tech Stack](#frontend-tech-stack)
3. [Project Structure](#project-structure)
4. [Component Standards](#component-standards)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Routing](#routing)
8. [Styling Guidelines](#styling-guidelines)
9. [Testing Requirements](#testing-requirements)
10. [Environment Configuration](#environment-configuration)
11. [Frontend Developer Standards](#frontend-developer-standards)

---

## Template and Framework Selection

### Framework Choice: Astro

**Astro** (latest stable, 4.x+) is selected as the primary framework for RefugiosLibresDignos Iteration I MVP.

### Starter Template

The project uses Astro's official TypeScript starter template:

```bash
pnpm create astro@latest refusdignos -- --template basics --typescript strict
```

### Rationale for Astro

**Performance-First Architecture:**
- **Zero JavaScript by default** - Ships only HTML and CSS, perfect for achieving <200KB JS bundle target
- **Islands Architecture** - Selective hydration for interactive components (carousel, form)
- **Static Site Generation (SSG)** - All pages pre-rendered at build time for optimal performance
- **Lighthouse scores** - Naturally achieves ≥95 desktop / ≥90 mobile targets

**Content-Focused Design:**
- **Content Collections API** - Type-safe content management for refuges data
- **Markdown/MDX support** - Ideal for static pages and refuge descriptions
- **Image optimization** - Built-in `astro:assets` for automatic AVIF/WebP generation

**Developer Experience:**
- **TypeScript-first** - Strict mode for maximum type safety
- **Vite integration** - Fast HMR and optimized builds
- **Component flexibility** - Write in `.astro`, React, Vue, Svelte (for future islands)
- **Simple mental model** - No complex state management for static content

**Future-Proof:**
- **Strapi integration path** - Iteration II can fetch content via API at build time
- **React islands ready** - Iteration III interactive map can use React island
- **Progressive enhancement** - Can add interactivity incrementally

### Pre-installed Dependencies

From Astro basics template:
- `astro` - Core framework
- `typescript` - Type safety
- `vite` - Build tool (integrated)

### Additional Required Dependencies

```json
{
  "dependencies": {
    "@astrojs/tailwind": "^5.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16"
  },
  "devDependencies": {
    "@typescript-eslint/parser": "^6.13.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "eslint": "^8.55.0",
    "eslint-plugin-astro": "^0.31.0",
    "prettier": "^3.1.0",
    "prettier-plugin-astro": "^0.12.0",
    "prettier-plugin-tailwindcss": "^0.5.9"
  }
}
```

### Folder Structure from Starter

```
refusdignos/
├── src/
│   ├── pages/           # Route-based pages (file-system routing)
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Layout templates
│   └── env.d.ts         # TypeScript environment definitions
├── public/              # Static assets (fonts, favicon, etc.)
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.mjs  # TailwindCSS configuration
└── package.json         # Dependencies and scripts
```

### Build and Development Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint . --ext .js,.ts,.astro",
    "format": "prettier --write \"**/*.{js,ts,astro,md,json}\""
  }
}
```

### Constraints Imposed by Astro

1. **Component files** use `.astro` extension (JSX-like syntax with frontmatter)
2. **Client-side interactivity** requires explicit `client:*` directives (client:load, client:visible, client:idle)
3. **No runtime server** for Iteration I - pure static generation
4. **TypeScript strict mode** enforced for Content Collections schema validation
5. **File-based routing** in `/src/pages/` directory

### Future Considerations

- **Iteration II:** Add `@astrojs/strapi` or custom API integration for CMS content
- **Iteration III:** Add React island for interactive map (`@astrojs/react` + Leaflet/Mapbox)
- **Iteration IV:** Authentication handled externally (Patreon API)
- **No PWA or native app** support needed

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-10-17 | 1.0 | Initial frontend architecture for Iteration I MVP | Winston (Architect) |

---

## Frontend Tech Stack

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Framework** | Astro | 4.x (latest stable) | Static site generation with Islands Architecture | Performance-first, zero-JS default, perfect for content sites |
| **Language** | TypeScript | 5.x | Type-safe development | Strict mode for Content Collections, prevents runtime errors |
| **Build Tool** | Vite | 5.x (bundled with Astro) | Fast development and optimized builds | Integrated with Astro, excellent HMR performance |
| **Styling** | TailwindCSS | 3.4.x | Utility-first CSS framework | Rapid development, excellent purging for minimal bundle size |
| **Component Library** | Custom (Astro components) | N/A | Reusable UI components | Astro's native component format, no external dependencies |
| **Form Handling** | HTML5 + Formspree/Netlify Forms | N/A | Contact form submission | No backend needed, external service handles submission |
| **Animation** | CSS Transitions + Astro Transitions | Built-in | Page transitions and micro-interactions | Minimal JS, leverages View Transitions API |
| **Image Optimization** | Astro Assets (`astro:assets`) | Built-in | Automatic AVIF/WebP generation | Built-in solution, no external dependencies |
| **SEO** | `@astrojs/sitemap` | 3.x | Sitemap generation | Automatic sitemap.xml generation at build time |
| **Testing** | Manual + Lighthouse CI | N/A (Iteration I) | Performance and accessibility audits | Pragmatic for static content site, automated tests in future iterations |
| **Linting** | ESLint + eslint-plugin-astro | 8.x | Code quality and consistency | Catches common mistakes, enforces standards |
| **Formatting** | Prettier + prettier-plugin-astro | 3.x | Code formatting | Consistent code style across team |
| **Package Manager** | pnpm | 8.x+ | Dependency management | Faster installs, better disk usage, monorepo-ready |
| **Deployment** | Vercel | N/A | Hosting and CI/CD | Zero-config deployment, automatic previews, global CDN |
| **Version Control** | Git + GitHub | N/A | Source control and collaboration | Industry standard, integrates with Vercel |

### Key Technology Decisions

**Why Astro over Next.js/Gatsby:**
- **Performance budget:** <200KB JS bundle requirement - Astro's zero-JS default makes this trivial
- **Content-first:** No complex state management or real-time features needed
- **Simplicity:** Simpler than Next.js for static sites, less complex than Gatsby
- **Future flexibility:** Can add framework-specific islands (React, Vue) as needed

**Why TailwindCSS:**
- **Rapid development:** Utility classes speed up styling
- **Purging:** Removes unused CSS at build time for minimal bundle
- **Consistency:** Design system tokens (colors, spacing) in config
- **Responsive design:** Mobile-first breakpoints built-in

**Why TypeScript Strict Mode:**
- **Content Collections:** Schema validation catches errors at build time
- **Refactoring safety:** Type checking prevents breaking changes
- **Future-proofing:** Easier Strapi integration with typed API responses

**Why pnpm:**
- **Performance:** Faster than npm/yarn
- **Disk efficiency:** Hard links save space
- **Monorepo-ready:** If project expands to multiple packages

**Why Vercel:**
- **Zero-config:** Automatic Astro detection and deployment
- **Preview environments:** Every PR gets a preview URL
- **Performance:** Global edge network, automatic image optimization
- **Free tier:** Sufficient for MVP traffic

---

## Project Structure

```
refusdignos/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, build, and test on PRs
│       └── lighthouse.yml            # Lighthouse CI for performance checks
├── public/
│   ├── fonts/
│   │   ├── inter-latin-400.woff2    # Inter Regular
│   │   ├── inter-latin-600.woff2    # Inter SemiBold
│   │   └── inter-latin-700.woff2    # Inter Bold
│   ├── media/                        # Non-optimized static images (if any)
│   ├── favicon.ico
│   └── robots.txt                    # Generated by @astrojs/sitemap
├── src/
│   ├── assets/                       # Optimized images (processed by astro:assets)
│   │   ├── hero/
│   │   ├── refugios/
│   │   └── logos/
│   ├── components/                   # Reusable UI components
│   │   ├── Carousel.astro           # Image carousel/gallery
│   │   ├── ContactForm.astro        # Contact form with validation
│   │   ├── Footer.astro             # Site footer
│   │   ├── Hero.astro               # Hero section component
│   │   ├── LogoWall.astro           # Sponsor logos grid
│   │   ├── Navbar.astro             # Navigation bar
│   │   ├── RefugioCard.astro        # Refuge card for listing
│   │   └── SEO.astro                # SEO meta tags component
│   ├── content/                      # Content Collections
│   │   ├── config.ts                # Content Collections schema
│   │   └── refugios/                # Refuge markdown files
│   │       ├── refugio-1.md
│   │       ├── refugio-2.md
│   │       └── refugio-3.md
│   ├── layouts/
│   │   └── BaseLayout.astro         # Base layout with navbar, footer, SEO
│   ├── pages/                        # File-based routing
│   │   ├── index.astro              # Homepage
│   │   ├── proyecto.astro           # Project/mission page
│   │   ├── refugios/
│   │   │   ├── index.astro          # Refuges listing page
│   │   │   └── [slug].astro         # Dynamic refuge detail pages
│   │   ├── patrocinadores.astro     # Sponsors page
│   │   ├── contacto.astro           # Contact page
│   │   └── legal/
│   │       ├── privacidad.astro     # Privacy policy
│   │       ├── terminos.astro       # Terms of service
│   │       └── cookies.astro        # Cookie policy
│   ├── styles/
│   │   └── global.css               # Global styles, Tailwind imports, font-face
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts                 # Shared types (Sponsor, etc.)
│   ├── utils/                        # Utility functions
│   │   └── seo.ts                   # SEO helper functions
│   └── env.d.ts                     # TypeScript environment definitions
├── .eslintrc.cjs                    # ESLint configuration
├── .gitignore
├── .prettierrc.cjs                  # Prettier configuration
├── astro.config.mjs                 # Astro configuration
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tailwind.config.mjs              # TailwindCSS configuration
└── tsconfig.json                    # TypeScript configuration
```

### Directory Conventions

**`/src/components/`**
- Reusable UI components
- File naming: PascalCase (e.g., `RefugioCard.astro`)
- One component per file
- Co-locate component-specific types in same file or `/src/types/`

**`/src/content/`**
- Content Collections only (refugios)
- Schema defined in `config.ts`
- Markdown files in subdirectories by collection name

**`/src/layouts/`**
- Layout templates that wrap page content
- Typically include navbar, footer, SEO
- File naming: PascalCase with `Layout` suffix (e.g., `BaseLayout.astro`)

**`/src/pages/`**
- File-based routing
- File naming: lowercase with hyphens for URLs (e.g., `contacto.astro` → `/contacto`)
- Dynamic routes use `[param].astro` syntax

**`/src/assets/`**
- Images processed by `astro:assets` (automatic optimization)
- Organized by usage context (hero, refugios, logos)

**`/public/`**
- Static assets served as-is (no processing)
- Fonts, favicon, robots.txt
- Reference with `/` prefix (e.g., `/fonts/inter.woff2`)

**`/src/styles/`**
- Global CSS, Tailwind imports
- Component-specific styles should be in `<style>` tags within components

**`/src/utils/`**
- Pure utility functions
- SEO helpers, formatting, validation

**`/src/types/`**
- Shared TypeScript type definitions
- Reusable interfaces and types

---

## Component Standards

### Component Template

All Astro components follow this structure:

```typescript
---
// Component: RefugioCard.astro
// Description: Card component for displaying refuge in listing page

// Imports
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

// Props interface
interface Props {
  refugio: CollectionEntry<'refugios'>;
  featured?: boolean;
}

// Destructure props
const { refugio, featured = false } = Astro.props;

// Derived data
const { slug } = refugio;
const { title, descripcionCorta, estado, imagenes } = refugio.data;
const mainImage = imagenes[0];

// Status badge styling
const statusStyles = {
  finalizado: 'bg-lime-green text-white',
  'en-obra': 'bg-sunrise-orange text-white',
  planificado: 'bg-off-white text-forest-green'
};
---

<!-- Component template -->
<article
  class={`
    group relative overflow-hidden rounded-lg bg-white shadow-md
    transition-all duration-300 hover:shadow-xl hover:scale-105
    ${featured ? 'border-2 border-sunrise-orange' : ''}
  `}
  aria-label={`Refugio: ${title}`}
>
  <!-- Image -->
  <a href={`/refugios/${slug}`} class="block aspect-video overflow-hidden">
    <Image
      src={mainImage.url}
      alt={mainImage.alt}
      width={600}
      height={400}
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
    />
  </a>

  <!-- Content -->
  <div class="p-4">
    <!-- Status badge -->
    <span
      class={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[estado]}`}
      aria-label={`Estado: ${estado}`}
    >
      {estado}
    </span>

    <!-- Title -->
    <h3 class="mt-2 text-xl font-bold text-forest-green">
      <a href={`/refugios/${slug}`} class="hover:text-lime-green focus:outline-none focus:ring-2 focus:ring-sunrise-orange">
        {title}
      </a>
    </h3>

    <!-- Description -->
    <p class="mt-2 text-sm text-forest-green/80 line-clamp-3">
      {descripcionCorta}
    </p>

    <!-- CTA -->
    <a
      href={`/refugios/${slug}`}
      class="mt-4 inline-block text-sm font-semibold text-sunrise-orange hover:underline focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
      aria-label={`Leer más sobre ${title}`}
    >
      Leer más →
    </a>
  </div>
</article>

<style>
  /* Component-specific styles (if needed beyond Tailwind) */
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
```

### Naming Conventions

**Component Files:**
- **Format:** PascalCase (e.g., `RefugioCard.astro`, `ContactForm.astro`)
- **Suffix:** No suffix needed (unlike React's `.tsx`)
- **One component per file**

**Component Props:**
- **Interface naming:** `Props` (convention in Astro)
- **Prop validation:** Use TypeScript interfaces
- **Optional props:** Use `?` and provide defaults

**CSS Classes:**
- **Tailwind utilities preferred** over custom CSS
- **BEM naming** if custom CSS needed: `block__element--modifier`
- **Scoped styles:** Use `<style>` tags (scoped by default in Astro)

**File Organization:**
- **Group by feature** for complex components (e.g., `Carousel/Carousel.astro`, `Carousel/CarouselDot.astro`)
- **Flat structure** for simple components (current approach)

**Imports:**
- **Astro components:** `.astro` extension (e.g., `import Hero from '../components/Hero.astro'`)
- **Images:** Use `astro:assets` (e.g., `import { Image } from 'astro:assets'`)
- **Types:** Import types with `type` keyword (e.g., `import type { CollectionEntry } from 'astro:content'`)

### Component Design Principles

1. **Semantic HTML:** Use `<article>`, `<section>`, `<nav>`, etc. over generic `<div>`
2. **Accessibility:** Include ARIA labels, roles, and keyboard navigation
3. **Performance:** Lazy load images except above-fold content
4. **Responsive:** Mobile-first design with Tailwind breakpoints
5. **Reusability:** Extract common patterns into shared components
6. **TypeScript:** Strict typing for props and data
7. **No client-side JS by default:** Only add `client:*` directives when necessary

---

## State Management

### State Management Approach

**Astro uses a different paradigm than React/Vue apps:**

Since RefugiosLibresDignos is a **static site with minimal interactivity**, traditional state management (Redux, Zustand, Pinia) is **not needed** for Iteration I.

### State Management Strategy

**1. Server-Side (Build Time):**
- Content Collections provide "state" at build time
- All refuge data loaded via `getCollection('refugios')`
- No runtime state changes

**2. Client-Side (Minimal):**
- **Carousel component:** Local state for current slide index
- **Mobile nav:** Toggle state for hamburger menu
- **Contact form:** Form field values and validation state

For these limited interactive components, **use vanilla JavaScript or lightweight state within components**:

```typescript
---
// Component: Carousel.astro (with client-side interactivity)
interface Props {
  images: Array<{ url: string; alt: string; caption?: string }>;
}

const { images } = Astro.props;
---

<div class="carousel" data-carousel>
  <!-- Image container -->
  <div class="carousel-track">
    {images.map((image, index) => (
      <div class="carousel-slide" data-slide={index}>
        <img src={image.url} alt={image.alt} />
        {image.caption && <p class="caption">{image.caption}</p>}
      </div>
    ))}
  </div>

  <!-- Controls -->
  <button data-carousel-prev aria-label="Previous image">‹</button>
  <button data-carousel-next aria-label="Next image">›</button>

  <!-- Dots -->
  <div class="carousel-dots">
    {images.map((_, index) => (
      <button data-carousel-dot={index} aria-label={`Go to slide ${index + 1}`}></button>
    ))}
  </div>
</div>

<script>
  // Client-side carousel logic
  class Carousel {
    private currentIndex = 0;
    private slides: NodeListOf<Element>;
    private dots: NodeListOf<Element>;
    private totalSlides: number;

    constructor(private container: Element) {
      this.slides = container.querySelectorAll('[data-slide]');
      this.dots = container.querySelectorAll('[data-carousel-dot]');
      this.totalSlides = this.slides.length;

      this.init();
    }

    private init() {
      this.showSlide(0);
      this.attachEventListeners();
    }

    private attachEventListeners() {
      const prevBtn = this.container.querySelector('[data-carousel-prev]');
      const nextBtn = this.container.querySelector('[data-carousel-next]');

      prevBtn?.addEventListener('click', () => this.prev());
      nextBtn?.addEventListener('click', () => this.next());

      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      this.container.addEventListener('touchstart', (e) => {
        touchStartX = (e as TouchEvent).changedTouches[0].screenX;
      });

      this.container.addEventListener('touchend', (e) => {
        touchEndX = (e as TouchEvent).changedTouches[0].screenX;
        this.handleSwipe();
      });

      const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) this.next();
        if (touchEndX > touchStartX + 50) this.prev();
      };
    }

    private showSlide(index: number) {
      this.slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      this.dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      this.currentIndex = index;

      // Announce to screen readers
      const liveRegion = document.getElementById('carousel-live-region');
      if (liveRegion) {
        liveRegion.textContent = `Slide ${index + 1} of ${this.totalSlides}`;
      }
    }

    private next() {
      const nextIndex = (this.currentIndex + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
    }

    private prev() {
      const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
    }

    private goToSlide(index: number) {
      this.showSlide(index);
    }
  }

  // Initialize all carousels on page
  document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('[data-carousel]');
    carousels.forEach(carousel => new Carousel(carousel));
  });
</script>

<!-- ARIA live region for screen reader announcements -->
<div id="carousel-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
```

### Store Structure

**Not applicable for Iteration I** - No centralized state store needed.

**Future Iterations:**
- **Iteration II:** If adding complex filtering/search, consider lightweight state
- **Iteration IV:** User authentication state handled by Patreon/external service
- **Iteration V:** Shopping cart state for e-commerce (consider Zustand or Nanostores)

### State Management Best Practices

1. **Prefer stateless components** - Derive data from props
2. **Use Content Collections for data** - Build-time "state"
3. **Vanilla JS for simple interactions** - Avoid framework overhead
4. **Islands for complex state** - If needed, use React/Preact island with hooks
5. **No global state** - Not needed for static site

---

## API Integration

### API Integration Strategy

**Iteration I (MVP):** No API integration required - fully static site.

**Future Iterations:**
- **Iteration II:** Strapi CMS API integration (build-time fetching)
- **Iteration IV:** Patreon API for membership management
- **Iteration V:** Stripe API for e-commerce

### Service Template (Future Use)

When API integration is needed in Iteration II, use this pattern:

```typescript
// src/services/strapi.ts
/**
 * Strapi CMS API Client
 * Used to fetch content at build time for static generation
 */

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface RefugioFromStrapi {
  id: number;
  attributes: {
    title: string;
    slug: string;
    descripcionCorta: string;
    descripcionLarga: string;
    brindadoA: string;
    estado: 'planificado' | 'en-obra' | 'finalizado';
    fechaPublicacion: string;
    imagenes: {
      data: Array<{
        id: number;
        attributes: {
          url: string;
          alternativeText: string;
          caption?: string;
        };
      }>;
    };
  };
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchFromStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch all refugios from Strapi
 */
export async function getRefugios(): Promise<RefugioFromStrapi[]> {
  const response = await fetchFromStrapi<StrapiResponse<RefugioFromStrapi[]>>(
    'refugios?populate=*&sort=fechaPublicacion:desc'
  );

  return response.data;
}

/**
 * Fetch single refugio by slug
 */
export async function getRefugioBySlug(
  slug: string
): Promise<RefugioFromStrapi | null> {
  const response = await fetchFromStrapi<StrapiResponse<RefugioFromStrapi[]>>(
    `refugios?filters[slug][$eq]=${slug}&populate=*`
  );

  return response.data[0] || null;
}

/**
 * Transform Strapi refugio to internal format
 */
export function transformRefugio(strapi: RefugioFromStrapi) {
  return {
    id: strapi.id,
    slug: strapi.attributes.slug,
    title: strapi.attributes.title,
    descripcionCorta: strapi.attributes.descripcionCorta,
    descripcionLarga: strapi.attributes.descripcionLarga,
    brindadoA: strapi.attributes.brindadoA,
    estado: strapi.attributes.estado,
    fechaPublicacion: new Date(strapi.attributes.fechaPublicacion),
    imagenes: strapi.attributes.imagenes.data.map((img) => ({
      url: `${STRAPI_URL}${img.attributes.url}`,
      alt: img.attributes.alternativeText,
      caption: img.attributes.caption,
    })),
  };
}
```

### API Client Configuration (Future Use)

```typescript
// src/config/api.ts
/**
 * API Configuration
 * Environment-based configuration for external services
 */

export const apiConfig = {
  strapi: {
    url: import.meta.env.STRAPI_URL || 'http://localhost:1337',
    token: import.meta.env.STRAPI_TOKEN,
    timeout: 10000, // 10 seconds
  },
  formspree: {
    endpoint: import.meta.env.FORMSPREE_ENDPOINT,
  },
  // Future: Patreon, Stripe, etc.
};

/**
 * Validate required environment variables
 */
export function validateApiConfig() {
  const required = ['STRAPI_URL', 'STRAPI_TOKEN'];
  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}
```

### Current API Integration: Contact Form

**Iteration I uses Formspree/Netlify Forms** - no custom API service needed:

```typescript
---
// Component: ContactForm.astro
const FORMSPREE_ENDPOINT = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;
---

<form
  action={FORMSPREE_ENDPOINT}
  method="POST"
  class="space-y-4"
  id="contact-form"
>
  <!-- Name field -->
  <div>
    <label for="name" class="block text-sm font-semibold text-forest-green">
      Nombre *
    </label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-sunrise-orange focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
    />
  </div>

  <!-- Email field -->
  <div>
    <label for="email" class="block text-sm font-semibold text-forest-green">
      Email *
    </label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-sunrise-orange focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
    />
  </div>

  <!-- Message field -->
  <div>
    <label for="message" class="block text-sm font-semibold text-forest-green">
      Mensaje *
    </label>
    <textarea
      id="message"
      name="message"
      rows="6"
      required
      class="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-sunrise-orange focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
    ></textarea>
  </div>

  <!-- Honeypot for spam prevention -->
  <input type="text" name="_gotcha" style="display:none" />

  <!-- Submit button -->
  <button
    type="submit"
    class="w-full rounded-md bg-forest-green px-6 py-3 font-semibold text-white transition-colors hover:bg-lime-green focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
  >
    Enviar Mensaje
  </button>

  <!-- Success message (shown by Formspree) -->
  <div id="form-success" class="hidden rounded-md bg-lime-green/10 p-4 text-sm text-lime-green">
    ¡Gracias! Tu mensaje ha sido enviado. Te responderemos pronto.
  </div>
</form>

<script>
  // Optional: Client-side form validation enhancement
  const form = document.getElementById('contact-form') as HTMLFormElement;

  form?.addEventListener('submit', (e) => {
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      e.preventDefault();
      alert('Por favor, introduce un email válido.');
    }
  });
</script>
```

---

## Routing

### Routing Structure

Astro uses **file-based routing** - the file structure in `/src/pages/` directly maps to URLs.

### Route Configuration

```
src/pages/                          URL
├── index.astro                  →  /
├── proyecto.astro               →  /proyecto
├── refugios/
│   ├── index.astro              →  /refugios
│   └── [slug].astro             →  /refugios/:slug
├── patrocinadores.astro         →  /patrocinadores
├── contacto.astro               →  /contacto
└── legal/
    ├── privacidad.astro         →  /legal/privacidad
    ├── terminos.astro           →  /legal/terminos
    └── cookies.astro            →  /legal/cookies
```

### Dynamic Routes

Dynamic routes use `[param].astro` syntax and require `getStaticPaths()` for static generation:

```typescript
---
// src/pages/refugios/[slug].astro
import { getCollection, type CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Carousel from '../../components/Carousel.astro';

// Generate static paths for all refugios at build time
export async function getStaticPaths() {
  const refugios = await getCollection('refugios');

  return refugios.map((refugio) => ({
    params: { slug: refugio.slug },
    props: { refugio },
  }));
}

// Type the props
type Props = {
  refugio: CollectionEntry<'refugios'>;
};

// Access props
const { refugio } = Astro.props;
const { title, descripcionCorta, descripcionLarga, brindadoA, estado, imagenes } = refugio.data;
---

<BaseLayout
  title={`${title} - RefugiosLibresDignos`}
  description={descripcionCorta}
  ogImage={imagenes[0]?.url}
>
  <!-- Page content -->
  <article class="container mx-auto px-4 py-12">
    <!-- Breadcrumbs -->
    <nav aria-label="Breadcrumb" class="mb-6 text-sm">
      <ol class="flex items-center space-x-2">
        <li><a href="/" class="text-sunrise-orange hover:underline">Inicio</a></li>
        <li aria-hidden="true">/</li>
        <li><a href="/refugios" class="text-sunrise-orange hover:underline">Refugios</a></li>
        <li aria-hidden="true">/</li>
        <li class="text-forest-green font-semibold" aria-current="page">{title}</li>
      </ol>
    </nav>

    <!-- Hero Section -->
    <header class="mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-forest-green mb-4">{title}</h1>

      <!-- Status badge -->
      <span class={`inline-block rounded-full px-4 py-2 text-sm font-semibold
        ${estado === 'finalizado' ? 'bg-lime-green text-white' : ''}
        ${estado === 'en-obra' ? 'bg-sunrise-orange text-white' : ''}
        ${estado === 'planificado' ? 'bg-off-white text-forest-green' : ''}
      `}>
        {estado}
      </span>
    </header>

    <!-- Image Gallery -->
    <Carousel images={imagenes} />

    <!-- Description -->
    <section class="mt-8 prose prose-lg max-w-none">
      <p class="text-xl text-forest-green/90 font-semibold">{descripcionCorta}</p>
      <div set:html={descripcionLarga} />
    </section>

    <!-- Brindado A -->
    {brindadoA && (
      <section class="mt-8 rounded-lg bg-tan/30 p-6">
        <h2 class="text-2xl font-bold text-forest-green mb-4">Brindado a</h2>
        <p class="text-forest-green/90">{brindadoA}</p>
      </section>
    )}

    <!-- Back to refugios -->
    <a
      href="/refugios"
      class="mt-8 inline-block text-sunrise-orange hover:underline focus:outline-none focus:ring-2 focus:ring-sunrise-orange"
    >
      ← Volver a Refugios
    </a>
  </article>
</BaseLayout>
```

### Navigation Patterns

**Active Link Detection:**

```typescript
---
// Component: Navbar.astro
const currentPath = Astro.url.pathname;

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/proyecto', label: 'Proyecto' },
  { href: '/refugios', label: 'Refugios' },
  { href: '/patrocinadores', label: 'Patrocinadores' },
  { href: '/contacto', label: 'Contacto' },
];

function isActive(href: string) {
  if (href === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(href);
}
---

<nav aria-label="Main navigation">
  <ul class="flex space-x-6">
    {navLinks.map(({ href, label }) => (
      <li>
        <a
          href={href}
          class={`
            transition-colors hover:text-lime-green focus:outline-none focus:ring-2 focus:ring-sunrise-orange
            ${isActive(href) ? 'font-bold text-sunrise-orange' : 'text-white'}
          `}
          aria-current={isActive(href) ? 'page' : undefined}
        >
          {label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

### 404 Error Handling

Create custom 404 page:

```typescript
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Página no encontrada - 404">
  <div class="container mx-auto px-4 py-24 text-center">
    <h1 class="text-6xl font-bold text-forest-green mb-4">404</h1>
    <p class="text-2xl text-forest-green/80 mb-8">
      Lo sentimos, esta página no existe.
    </p>
    <a
      href="/"
      class="inline-block rounded-md bg-forest-green px-6 py-3 font-semibold text-white transition-colors hover:bg-lime-green"
    >
      Volver al Inicio
    </a>
  </div>
</BaseLayout>
```

Configure in `astro.config.mjs`:

```javascript
export default defineConfig({
  // ... other config
  redirects: {
    '/old-path': '/new-path',
  },
});
```

---

## Styling Guidelines

### Styling Approach

**Primary:** TailwindCSS utility classes
**Secondary:** Scoped `<style>` tags in Astro components
**Global:** `/src/styles/global.css` for base styles and Tailwind imports

### TailwindCSS Configuration

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'forest-green': '#27582E',
        'sunrise-orange': '#E78A33',
        'lime-green': '#648D21',
        'tan': '#D8C28E',
        'off-white': '#E5E5E5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'DEFAULT': '4px',
      },
      transitionDuration: {
        'DEFAULT': '300ms',
      },
    },
  },
  plugins: [],
};
```

### Global Theme Variables

```css
/* src/styles/global.css */

/* Tailwind base, components, utilities */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Font Face Declarations */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-latin-400.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/inter-latin-600.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/inter-latin-700.woff2') format('woff2');
}

/* CSS Custom Properties (for advanced theming if needed) */
:root {
  /* Colors */
  --color-forest-green: #27582E;
  --color-sunrise-orange: #E78A33;
  --color-lime-green: #648D21;
  --color-tan: #D8C28E;
  --color-off-white: #E5E5E5;
  --color-white: #FFFFFF;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Spacing (multiples of 4px) */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}

/* Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-forest-green);
  background-color: var(--color-white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Accessibility: Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus Visible (for keyboard navigation) */
*:focus-visible {
  outline: 2px solid var(--color-sunrise-orange);
  outline-offset: 2px;
}

/* Utility: Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Prose Styles (for markdown content) */
.prose {
  max-width: 65ch;
}

.prose h2 {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-forest-green);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-lime-green);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose a {
  color: var(--color-sunrise-orange);
  text-decoration: underline;
  transition: opacity var(--transition-base);
}

.prose a:hover {
  opacity: 0.8;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

/* Custom Scrollbar (optional, for webkit browsers) */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-off-white);
}

::-webkit-scrollbar-thumb {
  background: var(--color-lime-green);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-forest-green);
}
```

### Component-Scoped Styles

Use `<style>` tags for component-specific styles (automatically scoped):

```astro
---
// Component with scoped styles
---

<div class="card">
  <h3 class="card-title">Title</h3>
  <p class="card-content">Content</p>
</div>

<style>
  /* These styles are scoped to this component only */
  .card {
    border: 1px solid var(--color-off-white);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    transition: box-shadow var(--transition-base);
  }

  .card:hover {
    box-shadow: var(--shadow-lg);
  }

  .card-title {
    margin-bottom: var(--spacing-sm);
    color: var(--color-forest-green);
  }

  .card-content {
    color: rgba(39, 88, 46, 0.8); /* forest-green with opacity */
  }
</style>
```

### Responsive Design Patterns

```astro
<!-- Mobile-first responsive design with Tailwind -->
<div class="
  grid
  grid-cols-1        /* 1 column on mobile */
  md:grid-cols-2     /* 2 columns on tablet (768px+) */
  lg:grid-cols-3     /* 3 columns on desktop (1024px+) */
  gap-6
">
  <!-- Grid items -->
</div>

<!-- Responsive text sizes -->
<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive Heading
</h1>

<!-- Responsive spacing -->
<section class="py-8 md:py-12 lg:py-16">
  <!-- Content -->
</section>
```

### Button Styles (Custom Components)

```css
/* src/styles/global.css - Add to @layer components */
@layer components {
  .btn {
    @apply inline-block rounded-md px-6 py-3 font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply btn bg-forest-green text-white hover:bg-lime-green focus:ring-sunrise-orange;
  }

  .btn-secondary {
    @apply btn border-2 border-sunrise-orange text-sunrise-orange hover:bg-sunrise-orange hover:text-white focus:ring-sunrise-orange;
  }

  .btn-disabled {
    @apply btn bg-off-white text-lime-green opacity-50 cursor-not-allowed;
  }
}
```

---

## Testing Requirements

### Testing Strategy for Iteration I

**Primary Focus:** Manual testing + Performance/Accessibility audits
**Automated Testing:** Minimal (static site with no complex logic)

### Testing Approach

**1. Manual Testing:**
- Visual regression across viewports (mobile, tablet, desktop)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Keyboard navigation and accessibility
- Form submission workflows

**2. Performance Audits:**
- Lighthouse CI integrated into GitHub Actions
- Target: ≥95 desktop / ≥90 mobile
- Core Web Vitals monitoring

**3. Accessibility Audits:**
- Axe DevTools browser extension
- Target: Zero violations (WCAG AA)
- Manual screen reader testing (NVDA/JAWS)

**4. Automated Testing (Future):**
- E2E smoke tests with Playwright (optional for Iteration I)
- Unit tests for utility functions (if complexity increases)
- Full test suite in Iteration II with CMS integration

### Component Test Template (Future Use)

When adding automated tests in future iterations, use Vitest + Testing Library:

```typescript
// src/components/__tests__/RefugioCard.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/astro';
import RefugioCard from '../RefugioCard.astro';

describe('RefugioCard', () => {
  const mockRefugio = {
    slug: 'test-refugio',
    data: {
      title: 'Test Refugio',
      descripcionCorta: 'A test description',
      estado: 'finalizado' as const,
      imagenes: [
        {
          url: '/test-image.jpg',
          alt: 'Test image',
        },
      ],
      brindadoA: 'Test community',
      descripcionLarga: 'Long description',
      fechaPublicacion: new Date('2025-01-01'),
    },
  };

  it('renders refugio title', async () => {
    render(RefugioCard, { props: { refugio: mockRefugio } });
    expect(screen.getByText('Test Refugio')).toBeInTheDocument();
  });

  it('displays status badge', async () => {
    render(RefugioCard, { props: { refugio: mockRefugio } });
    expect(screen.getByText('finalizado')).toBeInTheDocument();
  });

  it('renders image with correct alt text', async () => {
    render(RefugioCard, { props: { refugio: mockRefugio } });
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('links to refugio detail page', async () => {
    render(RefugioCard, { props: { refugio: mockRefugio } });
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/refugios/test-refugio');
  });

  it('applies featured styling when featured prop is true', async () => {
    render(RefugioCard, { props: { refugio: mockRefugio, featured: true } });
    const article = screen.getByRole('article');
    expect(article).toHaveClass('border-2', 'border-sunrise-orange');
  });
});
```

### Testing Best Practices

1. **Unit Tests:** Test individual components in isolation (future)
2. **Integration Tests:** Test component interactions (future)
3. **E2E Tests:** Test critical user flows - home → refuge detail → contact (optional for Iteration I)
4. **Coverage Goals:** Aim for 80% code coverage (when automated testing is implemented)
5. **Test Structure:** Arrange-Act-Assert pattern
6. **Mock External Dependencies:** API calls, form submissions
7. **Accessibility Testing:** Automated + manual testing required
8. **Performance Testing:** Lighthouse CI on every PR

### Lighthouse CI Configuration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4321
            http://localhost:4321/refugios
            http://localhost:4321/contacto
          configPath: './.lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm preview",
      "startServerReadyPattern": "Local:",
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/refugios",
        "http://localhost:4321/proyecto",
        "http://localhost:4321/contacto"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## Environment Configuration

### Required Environment Variables

```bash
# .env.example
# Copy this file to .env and fill in the values

# ============================================
# PUBLIC VARIABLES (Available in browser)
# ============================================

# Site URL (used for canonical URLs and sitemap)
PUBLIC_SITE_URL=https://refusdignos.com

# Formspree endpoint for contact form
PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID

# ============================================
# PRIVATE VARIABLES (Server-side only)
# ============================================

# Future: Strapi CMS (Iteration II)
# STRAPI_URL=http://localhost:1337
# STRAPI_TOKEN=your-strapi-token

# Future: Analytics (Iteration II)
# PLAUSIBLE_DOMAIN=refusdignos.com

# Future: Patreon API (Iteration IV)
# PATREON_CLIENT_ID=your-patreon-client-id
# PATREON_CLIENT_SECRET=your-patreon-client-secret

# Future: Stripe (Iteration V)
# STRIPE_PUBLIC_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
```

### Environment Variable Usage

**In Astro components (`.astro` files):**

```typescript
---
// Access environment variables
const siteUrl = import.meta.env.PUBLIC_SITE_URL;
const formspreeEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;

// Private variables only accessible server-side (build time)
const strapiToken = import.meta.env.STRAPI_TOKEN; // Not available in browser
---

<form action={formspreeEndpoint} method="POST">
  <!-- Form fields -->
</form>
```

**In client-side scripts (`<script>` tags):**

```typescript
<script>
  // Only PUBLIC_ variables are available in browser
  const siteUrl = import.meta.env.PUBLIC_SITE_URL;
  console.log('Site URL:', siteUrl);

  // This will be undefined (private variable)
  const strapiToken = import.meta.env.STRAPI_TOKEN; // undefined
</script>
```

### TypeScript Environment Types

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // Public variables
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_FORMSPREE_ENDPOINT: string;

  // Private variables (future)
  readonly STRAPI_URL?: string;
  readonly STRAPI_TOKEN?: string;
  readonly PLAUSIBLE_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Vercel Environment Variables

Configure in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables for each environment (Production, Preview, Development)
3. Mark sensitive variables as "Encrypted"
4. Never commit `.env` to version control (add to `.gitignore`)

---

## Frontend Developer Standards

### Critical Coding Rules

**1. Performance Rules:**
- ✅ **DO:** Use `astro:assets` for all images - automatic optimization
- ✅ **DO:** Lazy load images except above-fold content (`loading="lazy"`)
- ✅ **DO:** Include explicit `width` and `height` on all images (prevents CLS)
- ❌ **DON'T:** Import heavy libraries without `client:*` directives
- ❌ **DON'T:** Use `client:load` unless absolutely necessary (prefer `client:visible` or `client:idle`)

**2. Accessibility Rules:**
- ✅ **DO:** Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- ✅ **DO:** Include ARIA labels on interactive elements
- ✅ **DO:** Ensure keyboard navigation works (test with Tab key)
- ✅ **DO:** Test with screen readers (NVDA/JAWS/VoiceOver)
- ❌ **DON'T:** Use `<div>` for buttons or links
- ❌ **DON'T:** Rely on color alone to convey meaning

**3. TypeScript Rules:**
- ✅ **DO:** Use strict mode (`"strict": true` in tsconfig.json)
- ✅ **DO:** Define interfaces for all component props
- ✅ **DO:** Type Content Collections schemas properly
- ❌ **DON'T:** Use `any` type (use `unknown` if type is truly unknown)
- ❌ **DON'T:** Ignore TypeScript errors (fix them!)

**4. Content Collections Rules:**
- ✅ **DO:** Define schema in `/src/content/config.ts` before creating content
- ✅ **DO:** Use `getCollection()` and `getEntry()` for type-safe access
- ❌ **DON'T:** Import markdown files directly
- ❌ **DON'T:** Skip frontmatter validation

**5. Styling Rules:**
- ✅ **DO:** Use Tailwind utility classes for 90% of styling
- ✅ **DO:** Use design system tokens (colors, spacing) from `tailwind.config.mjs`
- ✅ **DO:** Scope custom CSS with `<style>` tags in components
- ❌ **DON'T:** Write inline styles (`style="..."`)
- ❌ **DON'T:** Create global CSS unless absolutely necessary

**6. Component Rules:**
- ✅ **DO:** Keep components focused (single responsibility)
- ✅ **DO:** Extract repeated patterns into reusable components
- ✅ **DO:** Document complex components with JSDoc comments
- ❌ **DON'T:** Create components with 50+ lines of logic
- ❌ **DON'T:** Mix presentation and business logic

**7. File Organization Rules:**
- ✅ **DO:** Follow project structure conventions (see Project Structure section)
- ✅ **DO:** Use PascalCase for component files (`RefugioCard.astro`)
- ✅ **DO:** Use kebab-case for page files that map to URLs (`contacto.astro`)
- ❌ **DON'T:** Create files in wrong directories (e.g., components in `/pages/`)

**8. SEO Rules:**
- ✅ **DO:** Use `BaseLayout` for all pages (includes SEO component)
- ✅ **DO:** Provide unique `title` and `description` for each page
- ✅ **DO:** Include Open Graph and Twitter Card meta tags
- ❌ **DON'T:** Duplicate content across pages (hurts SEO)
- ❌ **DON'T:** Forget sitemap generation (`@astrojs/sitemap`)

**9. Form Rules:**
- ✅ **DO:** Use HTML5 validation attributes (`required`, `type="email"`)
- ✅ **DO:** Associate labels with inputs (`<label for="...">`)
- ✅ **DO:** Include honeypot fields for spam prevention
- ❌ **DON'T:** Submit forms without validation
- ❌ **DON'T:** Store sensitive data in client-side storage

**10. Git/Version Control Rules:**
- ✅ **DO:** Commit often with descriptive messages
- ✅ **DO:** Create feature branches (`feature/refugio-carousel`)
- ✅ **DO:** Test locally before pushing (`pnpm build`)
- ❌ **DON'T:** Commit `.env` or secrets
- ❌ **DON'T:** Push directly to `main` (use PRs)

### Quick Reference

**Common Commands:**
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm astro check
```

**Key Import Patterns:**
```typescript
// Astro components
import Navbar from '../components/Navbar.astro';

// Content Collections
import { getCollection, getEntry } from 'astro:content';

// Images (optimized)
import { Image, Picture } from 'astro:assets';

// Types
import type { CollectionEntry } from 'astro:content';
```

**File Naming Conventions:**
- **Components:** PascalCase (`RefugioCard.astro`)
- **Pages:** kebab-case matching URL (`contacto.astro`)
- **Layouts:** PascalCase + `Layout` suffix (`BaseLayout.astro`)
- **Utils:** camelCase (`seo.ts`, `formatDate.ts`)

**Project-Specific Patterns:**

**1. Creating a new page:**
```typescript
---
// src/pages/nueva-pagina.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Nueva Página" description="Descripción de la página">
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-forest-green mb-6">Nueva Página</h1>
    <p class="text-body">Contenido...</p>
  </div>
</BaseLayout>
```

**2. Creating a new component:**
```typescript
---
// src/components/MiComponente.astro
interface Props {
  title: string;
  content?: string;
}

const { title, content } = Astro.props;
---

<div class="mi-componente">
  <h3 class="text-h3 text-forest-green">{title}</h3>
  {content && <p class="text-body">{content}</p>}
</div>
```

**3. Adding a new refuge:**
```markdown
---
# src/content/refugios/nuevo-refugio.md
title: "Refugio Nuevo"
slug: "nuevo-refugio"
descripcionCorta: "Descripción breve"
descripcionLarga: "Descripción larga en markdown..."
brindadoA: "Comunidad XYZ"
estado: "en-obra"
fechaPublicacion: 2025-01-15
imagenes:
  - url: "/assets/refugios/nuevo-1.jpg"
    alt: "Vista del refugio"
  - url: "/assets/refugios/nuevo-2.jpg"
    alt: "Interior del refugio"
seoTitle: "Refugio Nuevo - RefugiosLibresDignos"
seoDescription: "Conoce el Refugio Nuevo..."
---

Contenido adicional en markdown si es necesario...
```

**4. Using Content Collections:**
```typescript
---
import { getCollection } from 'astro:content';

// Get all refugios
const refugios = await getCollection('refugios');

// Filter by status
const refugiosFinalizados = await getCollection('refugios', ({ data }) => {
  return data.estado === 'finalizado';
});

// Sort by date
const refugiosSorted = refugios.sort((a, b) =>
  b.data.fechaPublicacion.getTime() - a.data.fechaPublicacion.getTime()
);
---
```

---

**End of Frontend Architecture Document**

---

## Next Steps for Developers

1. **Initialize Project:** Run `pnpm create astro@latest` with TypeScript template
2. **Install Dependencies:** Add TailwindCSS, sitemap integration, linting tools
3. **Configure Tailwind:** Set up design system tokens in `tailwind.config.mjs`
4. **Create Base Layout:** Build `BaseLayout.astro` with navbar, footer, SEO
5. **Define Content Collections:** Set up schema in `/src/content/config.ts`
6. **Begin Epic 1:** Follow user stories from PRD starting with Story 1.1

**Reference Documents:**
- [PRD](docs/prd.md) - Product requirements and user stories
- [Project Brief](docs/Project%20brief.md) - Original project specifications
- [Astro Docs](https://docs.astro.build) - Official Astro documentation

---

**Document Status:** ✅ Ready for Development
**Last Updated:** 2025-10-17
**Maintained By:** Winston (Architect)

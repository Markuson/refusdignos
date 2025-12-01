# RefugiosLibresDignos Development Roadmap - Iteration I

**Version:** 1.0
**Date:** 2025-10-18
**Status:** In Progress - Week 2
**Target Duration:** 4 weeks

---

## Table of Contents

1. [Overview](#overview)
2. [Timeline Summary](#timeline-summary)
3. [Week-by-Week Breakdown](#week-by-week-breakdown)
4. [Milestones & Deliverables](#milestones--deliverables)
5. [Dependencies & Critical Path](#dependencies--critical-path)
6. [Risk Management](#risk-management)
7. [Quality Gates](#quality-gates)
8. [Resource Requirements](#resource-requirements)

---

## Overview

This roadmap details the implementation plan for RefugiosLibresDignos Iteration I (MVP) - a static, high-performance website built with Astro that establishes the foundation for future dynamic features.

### Project Goals (Iteration I)

- ✅ Deploy production-ready static website
- ✅ Achieve Lighthouse ≥95 desktop / ≥90 mobile
- ✅ Implement WCAG AA accessibility compliance
- ✅ Create scalable architecture for future CMS integration
- ✅ Showcase organization mission and refuge projects

### Scope

**In Scope:**
- 3 Epics, 17 User Stories from PRD
- Homepage, Proyecto, Refugios (listing + detail), Colaboradores, Contacto, Legal pages
- Responsive design (mobile, tablet, desktop)
- Contact form with external service integration
- SEO optimization and sitemap generation

**Out of Scope (Future Iterations):**
- CMS integration (Iteration II)
- Interactive map (Iteration III)
- User authentication and payments (Iteration IV)
- E-commerce (Iteration V)

---

## Timeline Summary

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   WEEK 1    │   WEEK 2    │   WEEK 3    │   WEEK 4    │
│ Foundation  │   Content   │  Refuges    │  Polish &   │
│             │    Pages    │  Showcase   │  Deploy     │
└─────────────┴─────────────┴─────────────┴─────────────┘
│ Epic 1      │ Epic 2      │ Epic 3      │ Final QA    │
│ Stories 1.1-│ Stories 2.1-│ Stories 3.1-│ Performance │
│ 1.7         │ 2.4         │ 3.5         │ Optimization│
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Total Duration:** 4 weeks (160 hours estimated effort)

**Key Milestones:**
- ✅ Week 1: Foundation complete, all pages created
- 🔄 Week 2: Content pages created, pending Formspree integration
- Week 3: Refuge showcase complete
- Week 4: Production deployment with Lighthouse ≥95/90

---

## Week-by-Week Breakdown

### Week 1: Foundation & Core Infrastructure (Epic 1)

**Goal:** Establish technical foundation with Astro setup, core components, and deployment pipeline

**Stories:**
- ✅ 1.1: Project Initialization and Configuration
- ✅ 1.2: Design System Foundation
- ✅ 1.3: Responsive Navigation Bar
- ✅ 1.4: Footer Component
- ✅ 1.5: Base Layout Template
- ✅ 1.6: Basic Homepage with Deployment Verification
- ✅ 1.7: CI/CD Pipeline and Vercel Deployment

#### Day 1: Monday - Project Setup
**Time:** 6-8 hours

**Tasks:**
1. **Project Initialization** (Story 1.1)
   - [x] Run `pnpm create astro@latest refusdignos --template basics --typescript strict`
   - [x] Install dependencies: TailwindCSS, @astrojs/sitemap, @astrojs/tailwind
   - [x] Install dev dependencies: ESLint, Prettier, plugins
   - [x] Configure `astro.config.mjs` with integrations
   - [x] Configure `tsconfig.json` for strict mode
   - [x] Set up `.eslintrc.cjs` and `.prettierrc.cjs`
   - [x] Create `.gitignore` and initialize git repository
   - [x] Write README.md with setup instructions
   - [x] Test: `pnpm dev` and `pnpm build` run successfully

2. **Design System Configuration** (Story 1.2 - Part 1)
   - [x] Download Inter font files (woff2 format: 400, 600, 700 weights)
   - [x] Place fonts in `/public/fonts/`
   - [x] Configure `tailwind.config.mjs` with custom colors:
     - forest-green: #284c3e
     - sunrise-orange: #E78A33
     - lime-green: #648D21
     - tan: #D8C28E
     - off-white: #f7f4ef
   - [x] Add custom font family (Inter)
   - [x] Add custom typography scale (H1, H2, H3, body sizes)
   - [x] Add custom spacing, border-radius, transitions

**Deliverable:** Initialized Astro project with configured design system

---

#### Day 2: Tuesday - Global Styles & Core Components
**Time:** 6-8 hours

**Tasks:**
1. **Global Styles** (Story 1.2 - Part 2)
   - [x] Create `/src/styles/global.css`
   - [x] Add Tailwind imports (@tailwind base, components, utilities)
   - [x] Add @font-face declarations with font-display: swap
   - [x] Define CSS custom properties (colors, spacing, shadows)
   - [x] Add base styles (body, html, reset)
   - [x] Create utility classes (.sr-only, focus-visible styles)
   - [x] Add custom button component classes
   - [x] Add prose styles for markdown content
   - [x] Test: Verify CSS bundle < 50KB after purging

2. **Footer Component** (Story 1.4)
   - [x] Create `/src/components/Footer.astro`
   - [x] Add semantic `<footer>` element
   - [x] Implement sections: Legal, Social Media, Contact
   - [x] Add legal links (placeholder pages for now)
   - [x] Add social media icon links with ARIA labels
   - [x] Add contact email or placeholder
   - [x] Add copyright notice with dynamic year
   - [x] Style with Tailwind (tan background)
   - [x] Responsive layout: multi-column → stacked
   - [x] Test: Keyboard navigation, screen reader

**Deliverable:** Global styles configured, Footer component complete

---

#### Day 3: Wednesday - Navigation & Layout
**Time:** 6-8 hours

**Tasks:**
1. **Navigation Bar** (Story 1.3)
   - [x] Create `/src/components/Navbar.astro`
   - [x] Add semantic `<nav>` element
   - [x] Add logo placeholder/image
   - [x] Add desktop horizontal menu (Inicio, Proyecto, Refugios, Colaboradores, Contacto)
   - [x] Implement mobile hamburger menu toggle
   - [x] Add mobile menu overlay with vertical links
   - [x] Highlight active page (current path detection)
   - [x] Style: forest-green background, white text
   - [x] Add ARIA attributes (menu toggle, mobile menu)
   - [x] Make navbar sticky with proper z-index
   - [x] Test: Keyboard navigation, touch targets (44x44px)
   - [x] Test: Cross-browser (Chrome, Firefox, Safari, Edge)

2. **Base Layout Template** (Story 1.5)
   - [x] Create `/src/layouts/BaseLayout.astro`
   - [x] Define props interface (title, description, ogImage)
   - [x] Add `lang="es"` attribute on `<html>`
   - [x] Add viewport meta tag
   - [x] Create SEO meta tags (title, description, OG, Twitter Cards)
   - [x] Add canonical URL tag
   - [x] Include Navbar component
   - [x] Add semantic `<main>` element with slot
   - [x] Include Footer component
   - [x] Add font preload hints
   - [x] Configure favicon
   - [x] Implement sticky footer pattern (flexbox)
   - [x] Test: SEO meta tags visible in page source

**Deliverable:** Navbar and BaseLayout components complete

---

#### Day 4: Thursday - Basic Homepage
**Time:** 6-8 hours

**Tasks:**
1. **Homepage** (Story 1.6)
   - [x] Create `/src/pages/index.astro` using BaseLayout
   - [x] Add hero section with placeholder image
   - [x] Add project name heading (H1)
   - [x] Add tagline/subtitle (1 sentence)
   - [x] Add placeholder sections (Proyecto summary, Featured refuges, Sponsors, Final CTA)
   - [ ] Style responsively (mobile, tablet, desktop)
   - [x] Populate SEO metadata (title, description)
   - [x] Test: Page loads < 2 seconds
   - [x] Test: No console errors
   - [x] Test: All navigation links functional (may 404 temporarily)
   - [x] Test: Responsive on mobile, tablet, desktop
   - [x] Run Axe DevTools - zero critical violations
   - [x] Test: Lighthouse accessibility score

**Deliverable:** Basic homepage deployed locally

---

#### Day 5: Friday - CI/CD & Deployment
**Time:** 6-8 hours

**Tasks:**
1. **Vercel Deployment** (Story 1.7)
   - [x] Create GitHub repository and push code
   - [x] Connect repository to Vercel project
   - [x] Configure build settings:
     - Build command: `pnpm build`
     - Output directory: `dist`
     - Node.js version: 20.x LTS
   - [x] Enable automatic deployments for `main` branch
   - [x] Enable preview deployments for PRs
   - [x] Configure environment variables (if needed)
   - [ ] Enable HTTPS enforcement
   - [ ] Configure custom domain (if available)
   - [ ] Verify successful production deployment
   - [ ] Test: Live URL accessible

2. **GitHub Actions Workflow** (Story 1.7 - Optional but recommended)
   - [ ] Create `.github/workflows/ci.yml`
   - [ ] Add lint job (ESLint + Prettier check)
   - [ ] Add build job (pnpm build)
   - [ ] Add Lighthouse CI job (optional)
   - [ ] Configure workflow to run on PRs to main
   - [ ] Add deployment status badge to README
   - [ ] Test: Create test PR and verify workflow runs

3. **Week 1 Review**
   - [ ] Code review (self-review or peer)
   - [ ] Update README with deployment URL
   - [ ] Document any decisions/blockers
   - [ ] Run Lighthouse on deployed homepage (baseline metrics)

**Deliverable:** Production deployment live with CI/CD pipeline

**Week 1 Milestone:** ✅ Foundation complete, basic homepage deployed to production

---

### Week 2: Content Pages & Static Information (Epic 2)

**Goal:** Deliver complete organizational web presence with all static content pages

**Stories:**
- ✅ 2.1: Project Page - Mission and Values
- ✅ 2.2: Legal Pages - Privacy, Terms, Cookies
- ✅ 2.3: Sponsors Page with Logo Grid
- ✅ 2.4: Contact Page with Form Integration

#### Day 6: Monday - Project Page
**Time:** 6-8 hours

**Tasks:**
1. **Project Page** (Story 2.1)
   - [x] Create `/src/pages/proyecto.astro` using BaseLayout
   - [x] Add hero section with compelling image (volunteers/work)
   - [x] Add mission section (2-3 paragraphs)
   - [x] Add values section (bullet points or cards)
   - [x] Add impact section (statistics/achievements - can use placeholders)
   - [x] Add team section (photos + bios - optional, can defer)
   - [x] Add CTA linking to Sponsors or Contact
   - [x] Optimize images with Astro's `<Image>` component
   - [x] Implement semantic HTML (H1 → H3 hierarchy)
   - [x] Add SEO metadata (keywords about refuges, Pyrineos)
   - [x] Add descriptive alt text to all images
   - [x] Verify navbar link works
   - [x] Test: Lighthouse performance ≥90 mobile
   - [x] Test: Responsive design (mobile, tablet, desktop)

**Deliverable:** Project page complete with mission and values

---

#### Day 7: Tuesday - Legal Pages
**Time:** 4-6 hours

**Tasks:**
1. **Legal Pages** (Story 2.2)
   - [x] Create `/src/pages/legal/` directory
   - [x] Create `privacidad.astro` with BaseLayout
   - [x] Create `terminos.astro` with BaseLayout
   - [x] Create `cookies.astro` with BaseLayout
   - [x] Add SEO metadata for each page
   - [x] Structure content with clear sections and headings
   - [x] Add GDPR-compliant language (privacy policy template)
   - [x] Add contact email for privacy inquiries
   - [x] Display "Last updated" date on each page
   - [x] Verify footer links navigate correctly
   - [x] Use readable typography with line spacing
   - [x] Test: WCAG AA contrast requirements
   - [x] Test: Content is scannable and clear

**Note:** Legal content can be placeholder text initially, to be replaced with client-provided final text

**Deliverable:** All legal pages accessible and functional

---

#### Day 8: Wednesday - Sponsors Page
**Time:** 6-8 hours

**Tasks:**
1. **Sponsors Page** (Story 2.3)
   - [x] Create `/src/pages/colaboradores.astro` using BaseLayout
   - [x] Add introductory section (2-3 sentences)
   - [x] Define sponsor data structure (hardcoded array for MVP)
     ```typescript
     interface Sponsor {
       name: string;
       logo: string;
       url?: string;
       type: 'empresa' | 'institución' | 'particular';
     }
     ```
   - [x] Create sample sponsor data (4-6 sponsors)
   - [x] Implement responsive logo grid (3-4 cols desktop, 2 tablet, 1 mobile)
   - [x] Optimize logos with Astro `<Image>` component
   - [x] Add hover effect (subtle scale/opacity)
   - [x] Make logos clickable (new tab, rel="noopener noreferrer")
   - [x] Add "Become a Sponsor" CTA section
   - [x] Link CTA to Contact page
   - [x] Add proper alt text to all logos
   - [x] Differentiate sponsor types with headings (if applicable)
   - [x] Verify navbar link works
   - [x] Test: Lighthouse performance ≥90 mobile
   - [x] Test: Responsive grid reflow

**Deliverable:** Sponsors page with logo grid complete

---

#### Day 9: Thursday - Contact Page (Part 1)
**Time:** 6-8 hours

**Tasks:**
1. **Contact Page - Layout** (Story 2.4 - Part 1)
   - [x] Create `/src/pages/contacto.astro` using BaseLayout
   - [x] Implement 2-column layout (desktop) → stack (mobile)
   - [x] Add social media links section (left column)
     - [x] Facebook link with icon
     - [x] Instagram link with icon
     - [x] Twitter link with icon
     - [x] Organization email display
   - [x] Add contact form (right column)
     - [x] Name field (required, text input)
     - [x] Email field (required, email input)
     - [x] Message field (required, textarea, 6 rows)
     - [x] Honeypot field (hidden, for spam prevention)
     - [x] Submit button (primary style)
   - [x] Associate labels with inputs (for/id)
   - [x] Add placeholder text to fields
   - [x] Style form with Tailwind

2. **Contact Page - Form Integration** (Story 2.4 - Part 2)
   - [ ] TODO: Research and select form handling solution (Formspree, Netlify Forms, or alternative)
   - [ ] Sign up for chosen form service account
   - [ ] Create contact form endpoint
   - [ ] Add form endpoint to environment variables if needed
   - [ ] Configure form action to service endpoint
   - [ ] Add HTML5 validation (required attributes, email type)

   **Note:** Form integration postponed - requires research to determine best solution for production needs.

**Deliverable:** Contact page layout and basic form complete

---

#### Day 10: Friday - Contact Page (Part 2) & Week 2 Review
**Time:** 6-8 hours

**Tasks:**
1. **Contact Page - Validation & Enhancement** (Story 2.4 - Part 3)
   - [x] Add client-side validation script
     - [x] Email regex validation
     - [x] Inline error messages
     - [x] Error message styling
   - [x] Implement submit button states
     - [x] Disable button while submitting
     - [ ] Show loading state (optional)
   - [ ] Add success message div (hidden initially)
   - [x] Add error handling for failed submissions
   - [x] Add ARIA attributes for form validation
   - [ ] TODO: Test form submission once service selected
   - [ ] TODO: Verify email received
   - [x] Test: Keyboard navigation through form
   - [ ] Test: Screen reader announces errors
   - [ ] Test: Form works across browsers
   - [ ] Run Axe DevTools on contact page

2. **Week 2 Review**
   - [ ] Code review all Week 2 pages
   - [ ] Run Lighthouse on all new pages
   - [ ] Verify all navbar links work
   - [ ] Check responsive design on all pages
   - [ ] Update documentation if needed
   - [ ] Deploy Week 2 changes to production

**Deliverable:** Fully functional contact form with validation

**Week 2 Milestone:** ✅ All content pages complete (Proyecto, Legal, Sponsors, Contact)

---

### Week 3: Refuges Showcase & Image Galleries (Epic 3)

**Goal:** Implement core value proposition - the refuges showcase with listing and detail pages

**Stories:**
- ✅ 3.1: Refuge Content Collection Schema
- ✅ 3.2: Refuges Listing Page
- ✅ 3.3: Individual Refuge Detail Pages
- ✅ 3.4: Image Carousel/Gallery Component
- ✅ 3.5: Homepage Hero and Featured Refuges

#### Day 11: Monday - Content Collections Setup
**Time:** 6-8 hours

**Tasks:**
1. **Content Collection Schema** (Story 3.1)
   - [ ] Create `/src/content/config.ts`
   - [ ] Define `refugios` collection schema:
     ```typescript
     const refugiosCollection = defineCollection({
       type: 'content',
       schema: z.object({
         title: z.string(),
         slug: z.string(),
         descripcionCorta: z.string(),
         descripcionLarga: z.string(),
         brindadoA: z.string(),
         estado: z.enum(['planificado', 'en-obra', 'finalizado']),
         imagenes: z.array(z.object({
           url: z.string(),
           alt: z.string(),
           caption: z.string().optional(),
         })),
         fechaPublicacion: z.date(),
         localizacion: z.object({
           lat: z.number(),
           lng: z.number(),
         }).optional(),
         seoTitle: z.string(),
         seoDescription: z.string(),
         ogImage: z.string().optional(),
       }),
     });
     ```
   - [ ] Create `/src/content/refugios/` directory

2. **Sample Refuge Content** (Story 3.1 - continued)
   - [ ] Gather or create sample refuge images (3-5 images per refuge)
   - [ ] Place images in `/src/assets/refugios/`
   - [ ] Create `refugio-1.md` with frontmatter matching schema
     - Status: finalizado
     - Multiple images
     - Full descriptions
   - [ ] Create `refugio-2.md` - Status: en-obra
   - [ ] Create `refugio-3.md` - Status: planificado
   - [ ] Test: Run `pnpm astro check` - schema validates
   - [ ] Test: `getCollection('refugios')` retrieves entries
   - [ ] Test: Build fails if invalid frontmatter

**Deliverable:** Content Collections configured with 3 sample refuges

---

#### Day 12: Tuesday - Refuge Card Component & Listing Page
**Time:** 6-8 hours

**Tasks:**
1. **Refuge Card Component** (Story 3.2 - Part 1)
   - [ ] Create `/src/components/RefugioCard.astro`
   - [ ] Define Props interface (refugio, featured)
   - [ ] Implement card layout:
     - [ ] Main image (aspect ratio 3:2)
     - [ ] Title (H3)
     - [ ] Status badge (color-coded)
     - [ ] Short description (3 lines max, line-clamp)
     - [ ] "Leer más" link
   - [ ] Add card hover effects (elevation, scale, image zoom)
   - [ ] Implement status badge color logic:
     - Green: finalizado
     - Yellow: en-obra
     - Gray: planificado
   - [ ] Add ARIA labels for status badges
   - [ ] Style card with Tailwind
   - [ ] Test: Card is fully keyboard navigable

2. **Refuges Listing Page** (Story 3.2 - Part 2)
   - [ ] Create `/src/pages/refugios/index.astro`
   - [ ] Fetch refuges with `getCollection('refugios')`
   - [ ] Sort by `fechaPublicacion` (newest first)
   - [ ] Add page title (H1) and subtitle
   - [ ] Implement responsive grid (3 cols desktop, 2 tablet, 1 mobile)
   - [ ] Map refuges to RefugioCard components
   - [ ] Lazy load images except first 3
   - [ ] Handle empty state (no refuges)
   - [ ] Add semantic HTML (article/section)
   - [ ] Verify navbar link works
   - [ ] Test: Lighthouse performance ≥90 mobile
   - [ ] Test: Responsive grid across breakpoints

**Deliverable:** Refuges listing page with card grid

---

#### Day 13: Wednesday - Carousel Component
**Time:** 6-8 hours

**Tasks:**
1. **Carousel/Gallery Component** (Story 3.4)
   - [ ] Create `/src/components/Carousel.astro`
   - [ ] Define Props interface (images array)
   - [ ] Create HTML structure:
     - [ ] Image container
     - [ ] Previous/Next buttons (44x44px min)
     - [ ] Dot indicators
   - [ ] Add client-side script (`<script>` tag):
     - [ ] Carousel class with state management
     - [ ] showSlide(), next(), prev(), goToSlide() methods
     - [ ] Event listeners for buttons and dots
     - [ ] Keyboard navigation (arrow keys, ESC)
     - [ ] Touch/swipe gesture support
   - [ ] Add ARIA attributes:
     - [ ] aria-label on navigation controls
     - [ ] aria-live region for screen reader announcements
   - [ ] Implement smooth CSS transitions (300ms fade)
   - [ ] Style with Tailwind
   - [ ] Add captions below/overlay on images
   - [ ] Ensure no layout shift when images load
   - [ ] Test: Works without JavaScript (graceful degradation)
   - [ ] Test: Keyboard navigation with arrow keys
   - [ ] Test: Swipe gestures on mobile
   - [ ] Test: Screen reader announces current slide
   - [ ] Test: Cross-browser functionality

**Deliverable:** Accessible carousel component complete

---

#### Day 14: Thursday - Refuge Detail Pages
**Time:** 6-8 hours

**Tasks:**
1. **Refuge Detail Page** (Story 3.3)
   - [ ] Create `/src/pages/refugios/[slug].astro`
   - [ ] Implement `getStaticPaths()` to generate routes
     ```typescript
     export async function getStaticPaths() {
       const refugios = await getCollection('refugios');
       return refugios.map((refugio) => ({
         params: { slug: refugio.slug },
         props: { refugio },
       }));
     }
     ```
   - [ ] Add breadcrumb navigation (Inicio > Refugios > [Name])
   - [ ] Add hero section (title + status badge)
   - [ ] Integrate Carousel component with refuge images
   - [ ] Display short description (emphasized styling)
   - [ ] Render long description (markdown with prose styles)
   - [ ] Add "Brindado a" section (tan background)
   - [ ] Display key details (altitude, location, status)
   - [ ] Add publication date
   - [ ] Add "Volver a Refugios" back link
   - [ ] Populate SEO metadata from refuge seo fields
   - [ ] Lazy load gallery images (except hero)
   - [ ] Handle 404 for non-existent slugs
   - [ ] Test: Lighthouse performance ≥90 mobile
   - [ ] Test: All refuges accessible via listing page
   - [ ] Test: Carousel works on refuge detail pages

**Deliverable:** Individual refuge detail pages complete

---

#### Day 15: Friday - Homepage Enhancement & Week 3 Review
**Time:** 6-8 hours

**Tasks:**
1. **Homepage Enhancement** (Story 3.5)
   - [ ] Enhance hero section with compelling image
   - [ ] Add main headline and tagline
   - [ ] Add primary CTA button (to Refugios or Contacto)
   - [ ] Add project summary section (2-3 paragraphs + CTA)
   - [ ] Create featured refuges section:
     - [ ] Select 3-4 refuges (filter by status or manual)
     - [ ] Display in carousel or grid
     - [ ] Reuse RefugioCard component
   - [ ] Add sponsors preview section:
     - [ ] Display 6-8 sponsor logos
     - [ ] Link to full Colaboradores page
   - [ ] Add final CTA section ("Support the Project" → Contact)
   - [ ] Optimize hero image (priority loading, not lazy)
   - [ ] Implement alternating section backgrounds (white, tan, off-white)
   - [ ] Add semantic HTML with proper sections
   - [ ] Style CTAs consistently (primary/secondary buttons)
   - [ ] Test: Homepage Lighthouse ≥95 desktop, ≥90 mobile
   - [ ] Test: Total page weight < 2MB

2. **Week 3 Review**
   - [ ] Code review all refuge-related components
   - [ ] Test all user flows (homepage → refuges → detail → contact)
   - [ ] Run Lighthouse on all pages
   - [ ] Verify accessibility with Axe DevTools
   - [ ] Check responsive design on real devices
   - [ ] Deploy Week 3 changes to production

**Deliverable:** Complete refuge showcase with enhanced homepage

**Week 3 Milestone:** ✅ Core value proposition complete - refuges fully showcased

---

### Week 4: Polish, Optimization & Final Deployment

**Goal:** Finalize all features, optimize performance, ensure quality, and deploy production-ready MVP

#### Day 16: Monday - Performance Optimization
**Time:** 6-8 hours

**Tasks:**
1. **Image Optimization Audit**
   - [ ] Review all images for optimization opportunities
   - [ ] Ensure AVIF/WebP generation working correctly
   - [ ] Verify responsive srcset on all images
   - [ ] Check image sizes (target < 200KB per image)
   - [ ] Confirm lazy loading working (except priority images)
   - [ ] Verify explicit width/height on all images
   - [ ] Test: No Cumulative Layout Shift (CLS < 0.1)

2. **Code Splitting & Bundle Optimization**
   - [ ] Analyze JavaScript bundle size
     ```bash
     pnpm build && ls -lh dist/_astro/
     ```
   - [ ] Confirm total JS < 200KB
   - [ ] Verify Tailwind CSS purged correctly
   - [ ] Confirm CSS bundle < 50KB
   - [ ] Review `client:*` directives usage
   - [ ] Optimize carousel script size
   - [ ] Remove any unused dependencies

3. **Font Loading Optimization**
   - [ ] Verify font files are woff2 format
   - [ ] Check font preload hints in BaseLayout
   - [ ] Confirm `font-display: swap` working
   - [ ] Test: No Flash of Invisible Text (FOIT)
   - [ ] Measure font loading impact on LCP

**Deliverable:** Optimized assets and bundle sizes

---

#### Day 17: Tuesday - SEO & Accessibility Final Pass
**Time:** 6-8 hours

**Tasks:**
1. **SEO Optimization**
   - [ ] Audit all page titles (unique, descriptive)
   - [ ] Audit all meta descriptions (unique, compelling)
   - [ ] Verify Open Graph tags on all pages
   - [ ] Verify Twitter Card tags on all pages
   - [ ] Generate sitemap.xml (verify @astrojs/sitemap working)
   - [ ] Create/verify robots.txt
   - [ ] Test canonical URLs (verify Vercel deployment URL)
   - [ ] Add JSON-LD structured data:
     - [ ] Organization schema on homepage
     - [ ] Place/TouristAttraction schema on refuge pages
   - [ ] Verify heading hierarchy (H1 → H3, no skips)
   - [ ] Check for broken links (internal and external)
   - [ ] Test social sharing preview (Facebook, Twitter)

2. **Accessibility Final Audit**
   - [ ] Run Axe DevTools on every page - zero violations
   - [ ] Run Lighthouse accessibility audit - 100 score on all pages
   - [ ] Manual keyboard navigation test on all pages
   - [ ] Screen reader test (NVDA or VoiceOver) on key pages:
     - [ ] Homepage
     - [ ] Refugios listing
     - [ ] Refuge detail
     - [ ] Contact form
   - [ ] Color contrast validation (WebAIM Contrast Checker)
   - [ ] Verify focus indicators visible on all interactive elements
   - [ ] Test at 200% browser zoom - no horizontal scrolling
   - [ ] Test color blindness simulation (Chrome DevTools)
   - [ ] Verify all images have descriptive alt text
   - [ ] Verify form errors announced to screen readers

**Deliverable:** SEO and accessibility fully optimized

---

#### Day 18: Wednesday - Cross-Browser & Device Testing
**Time:** 6-8 hours

**Tasks:**
1. **Cross-Browser Testing**
   - [ ] Test on Chrome (latest version)
   - [ ] Test on Firefox (latest version)
   - [ ] Test on Safari (latest version)
   - [ ] Test on Edge (latest version)
   - [ ] Document any browser-specific issues
   - [ ] Fix critical browser compatibility bugs

2. **Device Testing**
   - [ ] Test on iPhone (iOS Safari) - portrait and landscape
   - [ ] Test on Android phone (Chrome) - portrait and landscape
   - [ ] Test on iPad (iOS Safari)
   - [ ] Test on Android tablet
   - [ ] Test on laptop (1366x768 common resolution)
   - [ ] Test on desktop (1920x1080)
   - [ ] Test on 4K display (ensure max-width works)
   - [ ] Document any device-specific issues
   - [ ] Fix critical responsive design bugs

3. **User Flow Testing**
   - [ ] Flow 1: Homepage → Refugios → Detail → Contact
   - [ ] Flow 2: Homepage → Proyecto → Colaboradores → Contact
   - [ ] Flow 3: Direct to Refuge detail → Volver → Listing
   - [ ] Flow 4: Contact form submission → Success
   - [ ] Flow 5: Navigation via navbar on all pages
   - [ ] Verify all CTAs work correctly
   - [ ] Verify all external links open in new tab

**Deliverable:** Cross-browser and cross-device compatibility verified

---

#### Day 19: Thursday - Content Finalization & QA
**Time:** 6-8 hours

**Tasks:**
1. **Content Review**
   - [ ] Replace placeholder refuge content with real data (if available)
   - [ ] Replace placeholder sponsor logos with real logos
   - [ ] Replace lorem ipsum text with final copy
   - [ ] Update legal pages with final text (privacy, terms, cookies)
   - [ ] Verify all images have proper credits/licenses
   - [ ] Proofread all text for typos and grammar
   - [ ] Verify Spanish language correctness

2. **Final Quality Assurance**
   - [ ] Run full site regression test:
     - [ ] All pages load without errors
     - [ ] All navigation links work
     - [ ] All images display correctly
     - [ ] All forms submit successfully
     - [ ] All CTAs navigate correctly
   - [ ] Run Lighthouse on all pages - record final scores
   - [ ] Create Lighthouse performance report
   - [ ] Verify all quality gates passed (see Quality Gates section)
   - [ ] Document any known issues or limitations
   - [ ] Create list of improvements for future iterations

**Deliverable:** Final content in place, QA complete

---

#### Day 20: Friday - Production Deployment & Launch
**Time:** 4-6 hours

**Tasks:**
1. **Pre-Deployment Checklist**
   - [ ] Verify all environment variables set in Vercel
   - [ ] Verify custom domain configured (if applicable)
   - [ ] Verify HTTPS enforced
   - [ ] Verify Formspree endpoint working
   - [ ] Review Vercel deployment settings
   - [ ] Create deployment backup (git tag)
   - [ ] Document deployment process

2. **Production Deployment**
   - [ ] Merge all changes to `main` branch
   - [ ] Monitor Vercel deployment
   - [ ] Verify build succeeds
   - [ ] Verify deployment completes
   - [ ] Test production URL
   - [ ] Run Lighthouse on production deployment
   - [ ] Verify all pages accessible
   - [ ] Test contact form on production
   - [ ] Monitor for any errors in Vercel logs

3. **Post-Deployment Verification**
   - [ ] Verify sitemap.xml accessible (https://site.com/sitemap.xml)
   - [ ] Verify robots.txt accessible
   - [ ] Submit sitemap to Google Search Console
   - [ ] Test social sharing links
   - [ ] Send test emails via contact form
   - [ ] Verify analytics tracking (if added)
   - [ ] Create list of production URLs for stakeholder review

4. **Documentation & Handoff**
   - [ ] Update README with production URL
   - [ ] Document deployment process
   - [ ] Create content update guide for client
   - [ ] Create troubleshooting guide
   - [ ] Document known issues and workarounds
   - [ ] Create handoff document for future development

**Deliverable:** Production deployment live and verified

**Week 4 Milestone:** 🚀 Production-ready MVP deployed

---

## Milestones & Deliverables

### Milestone 1: Foundation Complete (End of Week 1)
**Date:** End of Week 1
**Criteria:**
- ✅ Astro project initialized with TypeScript and TailwindCSS
- ✅ Design system configured (colors, typography, spacing)
- ✅ Navbar and Footer components complete and tested
- ✅ BaseLayout template functional
- ✅ Basic homepage deployed to Vercel production
- ✅ CI/CD pipeline operational

**Deliverables:**
- Live homepage URL
- GitHub repository with initial codebase
- Vercel deployment dashboard access

**Risks:**
- Vercel account setup delays → Mitigation: Set up account on Day 1
- Design system configuration complexity → Mitigation: Use provided specs exactly

---

### Milestone 2: Content Pages Complete (End of Week 2)
**Date:** End of Week 2
**Criteria:**
- ✅ Proyecto page live with mission and values
- ✅ Legal pages (Privacy, Terms, Cookies) accessible
- ✅ Sponsors page with logo grid functional
- ✅ Contact page with working form submission
- ✅ All navbar links functional
- ✅ All pages meet accessibility standards (Axe clean)

**Deliverables:**
- 7 pages deployed to production (Home, Proyecto, Refugios placeholder, Sponsors, Contact, 3 Legal pages)
- Contact form tested and receiving emails
- Lighthouse reports for all pages

**Risks:**
- Formspree integration issues → Mitigation: Test early, have Netlify Forms as backup
- Content delays from client → Mitigation: Use placeholder content, document what needs updating

---

### Milestone 3: Refuge Showcase Complete (End of Week 3)
**Date:** End of Week 3
**Criteria:**
- ✅ Content Collections configured and validated
- ✅ 3+ sample refuges with full content
- ✅ Refuges listing page with responsive grid
- ✅ Individual refuge detail pages functional
- ✅ Image carousel component working and accessible
- ✅ Enhanced homepage with featured refuges
- ✅ Core user flows tested (homepage → refuges → detail → contact)

**Deliverables:**
- Fully functional refuge showcase
- RefugioCard and Carousel reusable components
- Complete homepage with all sections

**Risks:**
- Carousel complexity → Mitigation: Use simple fade transition, defer lightbox to future
- Image optimization performance → Mitigation: Test with real images early

---

### Milestone 4: Production Launch (End of Week 4)
**Date:** End of Week 4
**Criteria:**
- ✅ Lighthouse ≥95 desktop, ≥90 mobile on all pages
- ✅ Zero Axe DevTools accessibility violations
- ✅ Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- ✅ Cross-device testing complete (mobile, tablet, desktop)
- ✅ All quality gates passed
- ✅ Production deployment live and stable
- ✅ Sitemap submitted to Google Search Console
- ✅ Documentation complete for client handoff

**Deliverables:**
- Production website URL
- Lighthouse performance report
- Accessibility audit report
- Documentation package (README, content guide, troubleshooting)
- Handoff notes for Iteration II

**Risks:**
- Performance targets not met → Mitigation: Continuous Lighthouse testing throughout Week 3-4
- Last-minute bugs → Mitigation: QA early and often, maintain issue tracker

---

## Dependencies & Critical Path

### Critical Path

The critical path (longest sequence of dependent tasks) determines the minimum project duration:

```
Day 1: Project Init → Day 2: Global Styles → Day 3: Layout Components →
Day 4: Homepage → Day 5: Deployment → Day 11: Content Collections →
Day 12: Listing Page → Day 13: Carousel → Day 14: Detail Pages →
Day 15: Homepage Enhancement → Days 16-20: Optimization & Launch
```

**Critical Path Duration:** 20 days (4 weeks)

### Task Dependencies

**Week 1 Dependencies:**
- Day 2 depends on Day 1 (need project initialized before global styles)
- Day 3 depends on Day 2 (need global styles before components)
- Day 4 depends on Day 3 (need layout before homepage)
- Day 5 depends on Day 4 (need homepage before deployment)

**Week 2 Dependencies:**
- All Week 2 tasks can proceed in parallel after Week 1 complete
- Each page (Proyecto, Legal, Sponsors, Contact) is independent

**Week 3 Dependencies:**
- Day 12 depends on Day 11 (listing page needs Content Collections)
- Day 14 depends on Day 13 (detail page needs Carousel)
- Day 15 depends on Day 12 (homepage uses RefugioCard)

**Week 4 Dependencies:**
- Days 16-19 can proceed in parallel
- Day 20 depends on Days 16-19 complete

### Opportunities for Parallel Work

**Week 2:** All content pages can be built in parallel if multiple developers available

**Week 4:** Optimization, SEO, accessibility, and testing can be done concurrently

---

## Risk Management

### High Priority Risks

#### Risk 1: Performance Targets Not Met
**Probability:** Medium
**Impact:** High
**Description:** Lighthouse scores < 95 desktop or < 90 mobile

**Mitigation Strategies:**
- Continuous Lighthouse testing starting Week 1
- Image optimization verification on Day 1 of Week 3
- Strict JS bundle size monitoring (< 200KB)
- Early carousel performance testing
- Remove any unnecessary dependencies immediately

**Contingency Plan:**
- If performance issues found Week 4: Remove non-critical animations, simplify carousel, aggressive image compression

---

#### Risk 2: Accessibility Violations
**Probability:** Low
**Impact:** High (Blocking)
**Description:** Axe DevTools or Lighthouse accessibility score < 100

**Mitigation Strategies:**
- Follow semantic HTML from start
- Test each component with Axe as built
- Keyboard navigation testing on every interactive element
- Screen reader testing on complex components (carousel, form)
- Color contrast validation during design system setup

**Contingency Plan:**
- Dedicated accessibility remediation day if violations found in Week 4
- External accessibility audit if needed (defer launch by 1-2 days if critical)

---

#### Risk 3: Content Delays
**Probability:** High
**Impact:** Medium
**Description:** Client doesn't provide real content (refuge descriptions, images, legal text) on time

**Mitigation Strategies:**
- Request all content at project start with clear deadline
- Use high-quality placeholder content that looks real
- Document exactly what content needs replacing
- Make content updates easy (Content Collections for refuges)

**Contingency Plan:**
- Launch with placeholder content if necessary
- Create content update guide for client to update post-launch
- Plan content update sprint in Week 5 if needed

---

#### Risk 4: Formspree Integration Issues
**Probability:** Low
**Impact:** Medium
**Description:** Contact form doesn't work or emails not received

**Mitigation Strategies:**
- Test Formspree integration early (Day 9)
- Verify email delivery immediately
- Have backup plan (Netlify Forms) ready
- Document troubleshooting steps

**Contingency Plan:**
- Switch to Netlify Forms if Formspree fails
- Alternative: Simple mailto: link as last resort (acceptable for MVP)
- Post-launch: Can switch to alternative service without code changes (environment variable swap)

---

### Medium Priority Risks

#### Risk 5: Browser Compatibility Issues
**Probability:** Medium
**Impact:** Medium
**Description:** Site doesn't work correctly on Safari or mobile browsers

**Mitigation Strategies:**
- Test on multiple browsers throughout development
- Use Astro's built-in compatibility (no cutting-edge features)
- Avoid CSS features with poor support
- Test carousel on mobile devices early

**Contingency Plan:**
- Browser-specific CSS fixes
- Polyfills if needed (add to bundle size budget)
- Simplify interactions if necessary (e.g., disable carousel animations on problematic browsers)

---

#### Risk 6: Carousel Complexity
**Probability:** Medium
**Impact:** Low
**Description:** Carousel component too complex, accessibility or performance issues

**Mitigation Strategies:**
- Keep carousel simple (fade transition only, no complex animations)
- Test accessibility early and often
- Use ARIA best practices from start
- Defer lightbox feature to future iteration

**Contingency Plan:**
- Simplify to basic image gallery (no carousel) if needed
- Use static image grid on refuge detail pages
- Add carousel in Iteration II with more time

---

### Low Priority Risks

#### Risk 7: Vercel Deployment Issues
**Probability:** Low
**Impact:** Medium
**Description:** Vercel build or deployment fails

**Mitigation Strategies:**
- Test deployment early (Day 5)
- Use standard Astro build (well-supported by Vercel)
- Document build settings clearly
- Monitor Vercel status during deployment

**Contingency Plan:**
- Alternative: Deploy to Netlify (Astro works on both)
- Debug build logs and fix configuration
- Vercel support available if needed

---

## Quality Gates

All quality gates must pass before production deployment.

### Quality Gate 1: Performance (Blocking)
**Criteria:**
- [ ] Lighthouse Performance ≥95 on desktop (all pages)
- [ ] Lighthouse Performance ≥90 on mobile (all pages)
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Total Blocking Time (TBT) < 150ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Total JavaScript bundle < 200KB
- [ ] Total CSS bundle < 50KB
- [ ] No images > 200KB

**Testing Method:** Lighthouse CI on all pages, bundle size analysis

**Failure Action:** Mandatory optimization sprint, defer deployment until passing

---

### Quality Gate 2: Accessibility (Blocking)
**Criteria:**
- [ ] Lighthouse Accessibility score = 100 on all pages
- [ ] Zero Axe DevTools violations on all pages (critical, serious, moderate)
- [ ] All interactive elements keyboard navigable
- [ ] All images have descriptive alt text
- [ ] All forms have associated labels
- [ ] Color contrast ≥4.5:1 (normal text), ≥3:1 (large text)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader testing passed (homepage, refuges, contact form)

**Testing Method:** Lighthouse, Axe DevTools, manual keyboard/screen reader testing

**Failure Action:** Blocking - must fix all violations before launch

---

### Quality Gate 3: Functionality (Blocking)
**Criteria:**
- [ ] All pages load without errors (check browser console)
- [ ] All navigation links work correctly
- [ ] All images display correctly (no broken images)
- [ ] Contact form submits successfully and email received
- [ ] All CTAs navigate to correct destinations
- [ ] Refuge listing shows all refuges
- [ ] Refuge detail pages load for all refuges
- [ ] Carousel works (navigation, keyboard, touch)
- [ ] Mobile menu opens/closes correctly
- [ ] All user flows complete successfully

**Testing Method:** Manual testing, user flow testing

**Failure Action:** Blocking - fix critical bugs before launch

---

### Quality Gate 4: SEO (Non-Blocking but Important)
**Criteria:**
- [ ] Lighthouse SEO score ≥95 on all pages
- [ ] All pages have unique title tags
- [ ] All pages have unique meta descriptions
- [ ] Open Graph tags present on all pages
- [ ] Twitter Card tags present on all pages
- [ ] sitemap.xml generated and accessible
- [ ] robots.txt present and correct
- [ ] Canonical URLs correct
- [ ] Heading hierarchy correct (H1 → H2 → H3, no skips)
- [ ] JSON-LD structured data present (Organization, Place schemas)

**Testing Method:** Lighthouse SEO audit, manual inspection

**Failure Action:** Non-blocking but should fix before launch if possible

---

### Quality Gate 5: Cross-Browser Compatibility (Non-Blocking)
**Criteria:**
- [ ] Site works on Chrome (latest)
- [ ] Site works on Firefox (latest)
- [ ] Site works on Safari (latest)
- [ ] Site works on Edge (latest)
- [ ] Site works on iOS Safari (iPhone)
- [ ] Site works on Chrome Android
- [ ] No critical visual bugs on any browser
- [ ] All interactions work on all browsers

**Testing Method:** Manual testing on each browser

**Failure Action:** Fix critical bugs, document minor issues for future fix

---

### Quality Gate 6: Responsive Design (Blocking)
**Criteria:**
- [ ] Site works on mobile (320px - 767px)
- [ ] Site works on tablet (768px - 1023px)
- [ ] Site works on desktop (1024px+)
- [ ] Site works on wide desktop (1920px+)
- [ ] No horizontal scrolling at any breakpoint
- [ ] All touch targets ≥44x44px on mobile
- [ ] Text readable on all screen sizes
- [ ] Images scale correctly
- [ ] Layout doesn't break at any viewport size

**Testing Method:** Chrome DevTools responsive mode, real device testing

**Failure Action:** Blocking - must fix responsive issues before launch

---

## Resource Requirements

### Team Composition (Recommended)

**Option 1: Single Full-Stack Developer**
- 160 hours estimated effort over 4 weeks
- 40 hours/week (full-time)
- Skills: Astro, TypeScript, TailwindCSS, responsive design, accessibility

**Option 2: Two Developers (Parallel Work)**
- Developer 1: Foundation + Refuges (Weeks 1, 3, 4)
- Developer 2: Content Pages (Week 2), assisting in Week 4
- Total time: 2.5 weeks with parallel work

**Option 3: Developer + Designer**
- Designer: Creates Figma mockups (Week 1-2)
- Developer: Implements based on mockups (Week 2-4)
- Total time: 4 weeks with overlap

### Tools & Accounts Needed

**Development:**
- [ ] Node.js 20.x LTS installed
- [ ] pnpm package manager installed
- [ ] Git and GitHub account
- [ ] Code editor (VS Code recommended)
- [ ] VS Code extensions: Astro, ESLint, Prettier, Tailwind CSS IntelliSense

**Design:**
- [ ] Figma account (optional but recommended)
- [ ] Image editing software (Photoshop, Figma, or free alternatives)
- [ ] Inter font files downloaded

**Deployment & Services:**
- [ ] Vercel account (free tier sufficient)
- [ ] GitHub account (for repository)
- [ ] Formspree account (free tier - 50 submissions/month)
- [ ] Google Search Console account (for sitemap submission)

**Testing:**
- [ ] Chrome browser with DevTools
- [ ] Firefox browser
- [ ] Safari browser (macOS)
- [ ] Edge browser
- [ ] Axe DevTools browser extension
- [ ] WAVE browser extension
- [ ] Mobile devices for testing (iPhone, Android)

**Optional:**
- [ ] Lighthouse CI account (for automated performance tracking)
- [ ] Plausible/Google Analytics (defer to Iteration II)

### Content Requirements

**From Client:**
- [ ] Organization logo (SVG or high-res PNG)
- [ ] Mission statement and values text
- [ ] 3-5 refuge projects with:
  - [ ] Name and location
  - [ ] 3-5 high-quality photos (min 1920x1280px)
  - [ ] Short description (1-2 sentences)
  - [ ] Long description (2-4 paragraphs)
  - [ ] "Brindado a" (dedicated to) text
  - [ ] Project status (planificado, en-obra, finalizado)
- [ ] 4-8 sponsor logos (vector preferred: SVG, or high-res PNG)
- [ ] Social media links (Facebook, Instagram, Twitter)
- [ ] Contact email address
- [ ] Legal text (privacy policy, terms, cookie policy) - can be template

**Placeholder Strategy:**
- Use Lorem Ipsum for text if not available
- Use Unsplash for placeholder images (mountain refuges, volunteers)
- Use generic sponsor logos
- Document all placeholders for client to replace

---

## Progress Tracking

### Daily Standup Questions

**What did I accomplish yesterday?**
- List completed tasks from roadmap

**What will I work on today?**
- List planned tasks from roadmap

**Any blockers or risks?**
- Dependencies, questions, technical issues

### Weekly Review

**End of Week Checklist:**
- [ ] Review week's milestone criteria
- [ ] Update roadmap if schedule changed
- [ ] Document decisions and learnings
- [ ] Run Lighthouse on all new pages
- [ ] Deploy week's work to production
- [ ] Update stakeholders on progress

### Status Reporting

**Weekly Status Report Template:**

```markdown
## Week [X] Status Report

### Completed This Week
- [ ] Story X.Y: Description
- [ ] Story X.Z: Description

### In Progress
- [ ] Story X.A: Current status

### Upcoming Next Week
- [ ] Story X.B: Planned
- [ ] Story X.C: Planned

### Metrics
- Lighthouse Performance: XX/100 (desktop), XX/100 (mobile)
- Lighthouse Accessibility: XX/100
- Pages Complete: X/12
- Code Coverage: XX% (if applicable)

### Risks & Issues
- Issue: Description → Mitigation

### Questions for Stakeholders
- Question 1
- Question 2
```

---

## Success Criteria

The Iteration I MVP is considered **successful** when:

1. ✅ **All 17 user stories complete** and acceptance criteria met
2. ✅ **Production deployment live** at https://refusdignos.com (or Vercel subdomain)
3. ✅ **Lighthouse ≥95 desktop, ≥90 mobile** on all pages
4. ✅ **Zero accessibility violations** (Axe DevTools clean, Lighthouse accessibility 100)
5. ✅ **All quality gates passed** (performance, accessibility, functionality, SEO, responsive)
6. ✅ **Contact form working** and emails received
7. ✅ **Refuge showcase functional** (listing, detail, carousel)
8. ✅ **Cross-browser compatible** (Chrome, Firefox, Safari, Edge)
9. ✅ **Mobile responsive** (320px - 1920px+ viewports)
10. ✅ **Documentation complete** (README, content guide, handoff notes)

---

## Next Steps After Iteration I

**Iteration II: CMS Integration (Week 5-10)**
- Strapi CMS setup and configuration
- Content migration from markdown to Strapi
- API integration with Astro
- Admin authentication for content management

**Iteration III: Interactive Map (Week 11-15)**
- Leaflet or Mapbox integration
- Geolocation data for all refuges
- Interactive markers linked to refuge pages
- Map performance optimization

**Iteration IV: Membership System (Week 16-21)**
- Patreon API integration (or alternative)
- User registration flow
- Payment integration (Stripe)
- Member dashboard

**Iteration V: E-commerce (Week 22-27)**
- Product catalog in Strapi
- Shopping cart functionality
- Checkout flow
- Order management

---

## Appendix: Useful Commands

**Development:**
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Type check
pnpm astro check

# Lint code
pnpm lint

# Format code
pnpm format
```

**Testing:**
```bash
# Run Lighthouse (install globally first)
npx lighthouse https://localhost:4321 --view

# Check bundle size
pnpm build && ls -lh dist/_astro/

# Test accessibility
# (Install axe-core CLI)
npx @axe-core/cli https://localhost:4321
```

**Git Workflow:**
```bash
# Create feature branch
git checkout -b feature/story-1-1-project-init

# Commit with conventional commits
git commit -m "feat: initialize Astro project with TypeScript"

# Push and create PR
git push -u origin feature/story-1-1-project-init
```

**Deployment:**
```bash
# Deploy to production (automatic on push to main)
git push origin main

# View deployment logs
# (Via Vercel dashboard)
```

---

**Document Status:** ✅ Ready for Development
**Last Updated:** 2025-10-18
**Maintained By:** Development Team

**Related Documents:**
- [Project Brief](Project%20brief.md)
- [PRD](prd.md)
- [UI Architecture](ui-architecture.md)
- [Front-End Spec](front-end-spec.md)

---

**End of Development Roadmap**

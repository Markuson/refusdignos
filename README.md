# RefugiosLibresDignos

**Espacios seguros, libres y dignos en los Pirineos**

RefugiosLibresDignos is a non-profit organization dedicated to rehabilitating abandoned mountain refuges in the Pyrenees and providing safe, free, and dignified spaces for people in need.

## 🏔️ Project Overview

This is **Iteration I (MVP)** - a high-performance static website built with Astro that showcases the organization's mission, rehabilitated refuges, and enables community engagement.

## 🚀 Tech Stack

- **Framework:** [Astro 5.x](https://astro.build) - Static Site Generation
- **Styling:** [Tailwind CSS 4.x](https://tailwindcss.com) - Utility-first CSS
- **Language:** TypeScript (Strict mode)
- **Deployment:** [Vercel](https://vercel.com)
- **Package Manager:** pnpm

## 📁 Project Structure

```
refusdignos/
├── docs/                    # Project documentation
│   ├── Project brief.md     # Overall project specifications
│   ├── prd.md              # Product Requirements Document
│   ├── ui-architecture.md  # Technical architecture
│   ├── front-end-spec.md   # UI/UX specifications
│   └── development-roadmap.md  # 4-week implementation plan
├── public/                  # Static assets
│   ├── fonts/              # Inter font files (to be added)
│   └── favicon.svg
├── src/
│   ├── components/         # Reusable Astro components
│   │   ├── Navbar.astro
│   │   └── Footer.astro
│   ├── layouts/            # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/              # File-based routing
│   │   └── index.astro
│   └── styles/             # Global styles
│       └── global.css
├── astro.config.mjs        # Astro configuration
├── tailwind.config.mjs     # Tailwind configuration
└── package.json
```

## 🎨 Design System

### Colors

- **Forest Green** (#27582E) - Primary color
- **Sunrise Orange** (#E78A33) - Accent color
- **Lime Green** (#648D21) - Secondary accent
- **Tan** (#D8C28E) - Backgrounds
- **Off-White** (#E5E5E5) - Borders, subtle backgrounds

### Typography

- **Font Family:** Inter (400, 600, 700 weights)
- **Base Size:** 18px
- **Responsive:** Scales from 16px (mobile) to 18px (desktop)

## 🧞 Commands

All commands are run from the root of the project:

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm check` | Run TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

## 🔧 Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd refusdignos
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Web3Forms API key:
   - Get a free API key at [https://web3forms.com/](https://web3forms.com/)
   - Add your key: `PUBLIC_WEB3FORMS_KEY=your_api_key_here`

4. **Download Inter fonts** (optional, uses system fonts as fallback)
   - See `public/fonts/README.md` for instructions

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open browser**
   - Navigate to `http://localhost:4321`

## 📦 Building for Production

```bash
pnpm build
```

The static site will be generated in the `dist/` directory, ready for deployment to Vercel.

## 🚢 Deployment

This project is configured for automatic deployment to Vercel:

- **Production:** Automatic deployment on push to `main` branch
- **Preview:** Automatic preview deployments for pull requests

## ✅ Quality Standards

### Performance Targets
- Lighthouse Performance: ≥95 (desktop), ≥90 (mobile)
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s

### Accessibility
- WCAG 2.1 Level AA compliance
- Lighthouse Accessibility: 100
- Zero Axe DevTools violations

## 📖 Documentation

- [Project Brief](docs/Project%20brief.md) - Strategic overview
- [PRD](docs/prd.md) - User stories and requirements
- [UI Architecture](docs/ui-architecture.md) - Technical specifications
- [Front-End Spec](docs/front-end-spec.md) - UI/UX design
- [Development Roadmap](docs/development-roadmap.md) - 4-week plan

## 🗺️ Roadmap

### Iteration I (MVP) - Current
- ✅ Foundation & Core Infrastructure
- 🔄 Content Pages (Proyecto, Legal, Sponsors, Contact)
- ⏳ Refuge Showcase (Listing & Detail Pages)
- ⏳ Production Deployment

### Future Iterations
- **Iteration II:** CMS Integration (Keystatic + Cloudinary) — Phase 1: refugios collection, Phase 2: remaining content
- **Iteration III:** Interactive Map (Leaflet/Mapbox)
- **Iteration IV:** Membership System (Payments)
- **Iteration V:** E-commerce

## 📝 License

Copyright © 2025 RefugiosLibresDignos. All rights reserved.

## 🤝 Contributing

This is a non-profit project. Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

---
title: "feat: Keystatic CMS + Aceternity UI Integration"
type: feat
status: completed
date: 2026-03-12
---

# ✨ feat: CMS Integration + Aceternity UI Dynamic Components

## Overview

Replace hardcoded content in all five page files with a **Keystatic** (Git-backed, file-based CMS) content layer, while adding polished animated UI components from **Aceternity UI** to elevate the visual experience. Deployment to Vercel remains unchanged.

The project's existing `draft/` folder already contains markdown drafts for every page — these serve as the seed content for the CMS collections.

---

## Problem Statement / Motivation

Currently all page content (bio text, service lists, benefit cards, contact details, opening hours) is hardcoded inside React component files. Any change — even fixing a phone number — requires a code edit, commit, and redeploy. The `draft/` folder shows this was always intended to be separated.

Additionally the site's design, while solid, lacks the dynamic feel of modern medical-practice websites. Aceternity UI components (Spotlight hero, card hover effects, animated borders) can add that premium finish without a full redesign.

---

## Proposed Solution

### CMS: Keystatic

**Keystatic** is the recommended CMS because:

| Criterion | Keystatic | Tina CMS | Sanity |
|-----------|-----------|----------|--------|
| Setup complexity | Simple | Medium | High |
| Cloud required? | No (local dev), GitHub mode for Vercel | Yes (Tina Cloud) | Yes |
| Storage format | YAML / Markdown files in repo | JSON / Markdown | Hosted DB |
| Admin UI | `/keystatic` (built-in) | `/admin` | `sanity.io/studio` |
| Next.js Pages Router support | ✅ | ✅ | ✅ |
| Cost for small sites | Free | Free tier | Free tier |
| Content in Git repo | ✅ | ✅ | ❌ |

Keystatic stores content as **YAML-frontmatter Markdown** files (`.mdoc` or `.md`) and exposes a local admin UI at `/keystatic`. In production (Vercel), it uses GitHub mode to commit content changes directly to the repository, triggering a Vercel redeploy automatically.

### Aceternity UI Components

Aceternity UI components are **copy-paste** React+Tailwind+Framer-Motion components. They require three dependencies: `framer-motion`, `clsx`, and `tailwind-merge`. Target components for this site:

| Page/Section | Component | Effect |
|---|---|---|
| Home Hero | **Spotlight** | Radial glow follows cursor behind the hero card |
| Home Benefits | **Card Hover Effect** | 3D tilt + glow on each benefit card |
| Home CTA | **Moving Border** | Animated gradient border on the CTA button |
| Services | **Background Beams** | Subtle animated beams behind service header |
| About | **Timeline** | Animated timeline for career/education entries |
| Contact | **Animated Tooltip** | Hover tooltips on contact info rows |

---

## Technical Considerations

### Architecture

```
Content files (repo)          Next.js Pages              Vercel
──────────────────────        ──────────────────        ─────────
content/
  home.yaml            →  getStaticProps()        →   Static HTML
  services.yaml        →  getStaticProps()        →   + ISR optional
  about.yaml           →  getStaticProps()
  ordination.yaml      →  getStaticProps()
  contact.yaml         →  getStaticProps()

keystatic.config.ts    →  /keystatic admin route  →   GitHub API writes
```

- Pages switch from hardcoded arrays → `getStaticProps` reading YAML via Keystatic's reader API
- No database, no API calls at runtime; site remains fully static
- `/keystatic` admin route is excluded from static export (API route)
- In local dev: Keystatic uses local filesystem
- In production (Vercel): Keystatic uses GitHub App authentication

### Content Model

Each page maps to one Keystatic **singleton** (single document, not a collection):

**`content/home.yaml`** fields:
- `heroTitle`, `heroSubtitle` (string)
- `benefits[]` → `{ img, title, desc }` (array of objects)
- `ctaTitle`, `ctaSubtitle` (string)

**`content/about.yaml`** fields:
- `pageTitle`, `pageSubtitle` (string)
- `bioText` (text)
- `education[]` → `{ institution, detail }` (array)
- `career[]` → `{ years, description }` (array)
- `specializations[]` (array of strings)

**`content/services.yaml`** fields:
- `introText` (rich text / string)
- `services[]` (array of strings)
- `operativeProcedures[]` → `{ img, title, desc }` (array)

**`content/ordination.yaml`** fields:
- `openingHours[]` → `{ day, time }` (array)
- `notes` (string)

**`content/contact.yaml`** fields:
- `address`, `phone`, `email`, `hours` (strings)
- `arrivalInfo` (string)
- `impressum` (rich text / Markdoc)

### Aceternity UI Integration

- Components are manually placed into `components/ui/` (copy-paste from aceternity.com)
- Requires `tailwind.config.js` extensions: `animation`, `keyframes`, `backgroundImage`
- `cn()` utility helper needed: `lib/utils.js` wrapping `clsx` + `tailwind-merge`

### Performance Implications

- Framer Motion adds ~30 KB gzip. Use `dynamic()` with `ssr: false` for heavy animation components to avoid hydration issues
- All content stays static at build time — no performance impact from CMS
- Keystatic admin route only loads on `/keystatic` path

### Security Considerations

- Keystatic GitHub mode uses OAuth; admin route should be protected (Keystatic handles this via GitHub auth)
- No user-submitted content is stored via CMS
- Contact form API (`/api/contact.js`) remains unchanged
- No secrets added to client-side code

---

## System-Wide Impact

- **`_app.js`**: No changes needed; Nav and Footer can optionally read CMS data for contact info
- **`pages/` files**: All gain `getStaticProps` — this is an additive change, not a breaking one
- **`components/`**: Aceternity UI components added to `components/ui/` — no existing components modified
- **`tailwind.config.js`**: Needs animation keyframes added for Aceternity components
- **`package.json`**: Three new deps (`framer-motion`, `clsx`, `tailwind-merge`) + Keystatic packages
- **`next.config.js`**: Keystatic requires one line to add its Next.js plugin wrapper

---

## Acceptance Criteria

- [x] All five pages read their text content via Keystatic singletons (`getStaticProps`)
- [x] Editing content via `/keystatic` admin UI and saving triggers a Vercel redeploy through GitHub
- [x] No content strings remain hardcoded in page components (only layout/structure code)
- [x] `draft/` folder content is migrated to corresponding `content/*.yaml` files with corrected image paths and content updated from current pages
- [x] At least 3 Aceternity UI components are live across the site (Spotlight, Card Hover, Moving Border minimum)
- [x] Framer Motion animated components use `dynamic()` import on SSR-sensitive sections
- [x] `npm run build` passes with no errors on Vercel
- [x] `/keystatic` admin route is accessible locally and in production (with GitHub auth)
- [x] Existing functionality (contact form, nav, footer, mobile hamburger) is unaffected

---

## Success Metrics

- A non-developer (e.g., practice staff) can update the phone number, opening hours, or benefit text via the `/keystatic` admin UI without touching code
- Lighthouse score remains ≥ 90 on Performance after Framer Motion addition
- `npm run build` clean, zero TypeScript/ESLint errors

---

## Implementation Phases

### Phase 1 — Keystatic CMS Setup

**Tasks:**
1. Install Keystatic packages: `@keystatic/core`, `@keystatic/next`
2. Create `keystatic.config.ts` (or `.js`) defining 5 singletons with the content schema above
3. Wrap `next.config.js` with Keystatic's Next.js plugin
4. Add `/pages/keystatic/[[...params]].js` (admin UI route) and `/pages/api/keystatic/[...params].js` (API handler)
5. Create initial `content/` YAML files migrated from `draft/` folder
6. Test admin UI locally at `http://localhost:3000/keystatic`

**Files touched:**
- `keystatic.config.js` (new)
- `next.config.js` (modified)
- `pages/keystatic/[[...params]].js` (new)
- `pages/api/keystatic/[...params].js` (new)
- `content/home.yaml` (new — from `draft/home.md` and updated from `pages/index.js` to fit latest changes)
- `content/about.yaml` (new — from `draft/about.md` and updated from `pages/about.js` to fit latest changes)
- `content/services.yaml` (new — from `draft/services.md` and updated from `pages/services.js` to fit latest changes)
- `content/ordination.yaml` (new — from `draft/ordination.md` and updated from `pages/ordination.js` to fit latest changes)
- `content/contact.yaml` (new — from `draft/contact.md` and updated from `pages/contact.js` to fit latest changes)

### Phase 2 — Wire Pages to CMS

**Tasks:**
1. Add `getStaticProps` to `pages/index.js` — read `content/home.yaml` via `createReader()`
2. Add `getStaticProps` to `pages/about.js` — read `content/about.yaml`
3. Add `getStaticProps` to `pages/services.js` — read `content/services.yaml`
4. Add `getStaticProps` to `pages/ordination.js` — read `content/ordination.yaml`
5. Add `getStaticProps` to `pages/contact.js` — read `content/contact.yaml`
6. Remove all hardcoded content arrays from page files (keep only layout JSX)

**Files touched:**
- `pages/index.js`
- `pages/about.js`
- `pages/services.js`
- `pages/ordination.js`
- `pages/contact.js`

### Phase 3 — Aceternity UI Components

**Tasks:**
1. Install: `npm install framer-motion clsx tailwind-merge`
2. Create `lib/utils.js` with `cn()` helper
3. Extend `tailwind.config.js` with Aceternity animation keyframes (backgroundPosition, spotlight, etc.)
4. Copy Spotlight component → `components/ui/Spotlight.js`
5. Copy Card Hover Effect → `components/ui/CardHoverEffect.js`
6. Copy Moving Border → `components/ui/MovingBorder.js`
7. Replace hero section in `pages/index.js` with Spotlight wrapper
8. Replace benefit cards in `pages/index.js` with CardHoverEffect
9. Replace CTA link button in `pages/index.js` with MovingBorder
10. (Optional) Add Background Beams to `pages/services.js` header
11. (Optional) Add animated Timeline to `components/CareerTimeline.js` for `pages/about.js`

**Files touched:**
- `package.json`
- `lib/utils.js` (new)
- `tailwind.config.js`
- `components/ui/Spotlight.js` (new)
- `components/ui/CardHoverEffect.js` (new)
- `components/ui/MovingBorder.js` (new)
- `components/ui/BackgroundBeams.js` (new, optional)
- `pages/index.js`
- `pages/services.js` (optional)
- `pages/about.js` (optional)

---

## Alternative Approaches Considered

| Approach | Why Rejected |
|---|---|
| **Tina CMS** | Requires Tina Cloud account and an additional OAuth setup; adds a cloud dependency for a simple 5-page site |
| **Sanity** | Significant overkill for a 5-page brochure site; content stored externally (not in Git) |
| **gray-matter + MDX** | No admin UI — the doctor/staff would need to edit raw Markdown files and commit. Not user-friendly enough. |
| **Contentful / Prismic** | Paid for production; content stored outside repo; too heavyweight |
| **Next.js App Router migration** | Not required for this feature and would risk breaking existing functionality |

---

## Dependencies & Risks

| Dependency | Risk | Mitigation |
|---|---|---|
| `@keystatic/core`, `@keystatic/next` | Breaking changes in Keystatic (actively developed) | Pin to specific version at install time |
| `framer-motion` | Increases bundle size | Use `dynamic()` imports for animated components |
| Keystatic GitHub mode on Vercel | Requires GitHub App installation + env vars | Document setup steps; test in staging branch first |
| Aceternity UI component compatibility | Components use Tailwind class names that may conflict | Use `tailwind-merge` via `cn()` helper to resolve conflicts |
| Vercel build with Keystatic | `/keystatic` route is a catch-all that needs correct Next.js config | Follow Keystatic Next.js docs exactly |

---

## Sources & References

### Internal

- Existing draft content: [draft/home.md](../../draft/home.md), [draft/about.md](../../draft/about.md), [draft/services.md](../../draft/services.md)
- Current page implementations: [pages/index.js](../../pages/index.js), [pages/about.js](../../pages/about.js), [pages/services.js](../../pages/services.js)
- Tailwind color tokens: [tailwind.config.js](../../tailwind.config.js) — preserve `primary`, `accent`, `hero-beige`, `footer-brown`, `banner-gray`
- App layout: [pages/_app.js](../../pages/_app.js)

### External

- Keystatic docs: https://keystatic.com/docs/installation-nextjs-pages-router
- Keystatic GitHub mode (production): https://keystatic.com/docs/github-mode
- Aceternity UI components: https://ui.aceternity.com/components
- Aceternity UI install guide: https://ui.aceternity.com/docs/install-nextjs
- Framer Motion docs: https://www.framer.com/motion/

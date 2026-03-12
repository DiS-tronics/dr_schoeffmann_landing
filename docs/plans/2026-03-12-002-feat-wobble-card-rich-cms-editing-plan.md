---
title: "feat: WobbleCard UI + Rich CMS Content Editing"
type: feat
status: completed
date: 2026-03-12
---

# feat: WobbleCard UI + Rich CMS Content Editing

## Overview

Two related improvements to the Dr. Schöffmann CMS site:

1. **WobbleCard** — replace the `CardHoverEffect` on the Home Benefits section with Aceternity UI's WobbleCard (mouse-tracked 3-D tilt effect, distinct gradient backgrounds per card).
2. **Rich CMS editing** — expand the Keystatic schema beyond simple text fields to enable image uploads via the admin UI, rich text (WYSIWYG), and flexible content blocks so editors can add new paragraphs, images, or sections — not just edit fixed text strings.

Built on the Keystatic + Aceternity UI foundation from `feat/keystatic-cms-aceternity-ui` (commit `38bdf21`).

---

## Problem Statement / Motivation

### WobbleCard
`CardHoverEffect` shows cards with an animated hover background but lacks visual depth. Aceternity's WobbleCard provides a 3-D perspective tilt that follows the user's cursor, giving each benefit card its own personality through distinct color gradients.

### Rich CMS editing
The current schema uses `fields.text({ multiline: true })` throughout, meaning all fields are plain-text input boxes. This creates three pain points:
- **No image upload** — adding images requires manually typing file paths (e.g. `src: /images/ordination1.jpg`). Images cannot be uploaded from the admin UI.
- **No rich text** — `bioText` on the About page is a single plain-text box; no formatting, paragraphs, lists or headings possible.
- **Fixed structure** — every page has a rigid fixed schema. Editors cannot add a new section, a new text paragraph, or a new image beyond what's explicitly defined.

---

## Proposed Solution

### Phase 1 — WobbleCard component
Create `components/ui/WobbleCard.js` (Framer Motion + `onMouseMove` tilt). Replace `<HoverEffect>` in `pages/index.js` with a grid of `<WobbleCard>` components, one per benefit. Each card receives a gradient variant (blue, teal, slate) so the three benefits are visually distinct.

### Phase 2 — `fields.image()` for image uploads
Switch all image-path text fields to `fields.image()`:
- `home.benefits[].img`
- `services.operativeProcedures[].img`
- `ordination.images[].src`

`fields.image()` renders an image picker / file-upload widget in the Keystatic admin. Images are committed to the repo under `public/images/` and the stored YAML value becomes just the filename (e.g. `ordination1.jpg`). The page code constructs the full URL using the configured `publicPath` prefix.

**Content migration required**: existing YAML values like `/images/ordination1.jpg` must change to just `ordination1.jpg` (strip the directory prefix, which is now handled by `publicPath`).

### Phase 3 — Rich text + flexible content blocks
Two additions:

#### 3a — `fields.document()` for rich areas
Change `about.bioText` from `fields.text({ multiline: true })` to `fields.document()`. This gives the editor a WYSIWYG panel (headings, bold, italic, bullet lists, links) instead of a plain-text box.

Rendering upgrade: import `DocumentRenderer` from `@keystatic/core/renderer` and replace the bare `<p>{bioText}</p>` in `pages/about.js`.

Optionally apply the same to `services.introText` if it grows beyond a single paragraph.

> **Format note**: `fields.document()` in a YAML-format singleton stores the document as a separate `content.mdoc` file in the same `path` directory. The singleton format changes to `format: { contentField: 'bioContent' }`. Non-document fields remain as YAML front-matter. Existing `bioText` plain text is migrated into the new document field.

#### 3b — `fields.blocks()` section arrays for About and Services
Add optional `extraSections` block arrays to the `about` and `services` singletons. Available block types:

| Block type | Fields | Purpose |
|---|---|---|
| `paragraph` | `text` (multiline) | Add a new freeform text section |
| `imageBlock` | `image` (image field) + `caption` (text) | Photo + caption block |
| `highlight` | `text` | Callout box / highlighted notice |

This lets the editor click + choose block type and compose new content anywhere in the page below the fixed fields, without touching code.

---

## Technical Considerations

- **`@keystatic/core` v0.5.48**: `fields.image()` and `fields.document()` are both fully supported. `fields.blocks()` is available as of v0.5.x.
- **`framer-motion` v12**: `useMotionValue` + `useSpring` should be used for smooth WobbleCard tilt (avoids janky `setState` on every `mousemove`).
- **WobbleCard perspective**: CSS `perspective` is applied inline (e.g. `style={{ perspective: '800px' }}`). No Tailwind custom utility needed.
- **Image field / YAML migration**: the stored filename (e.g. `ordination1.jpg`) requires `directory: 'public/images'` + `publicPath: '/images/'` on all image fields so existing images in `public/images/` still resolve without moving files.
- **Document field + SSG**: `fields.document()` reader returns an async function. Call `await about.bioContent()` in `getStaticProps` before passing to the page component as a serializable prop.
- **`DocumentRenderer`**: lightweight, zero client-side JS in the shipped bundle (pure server render in `getStaticProps`).

---

## System-Wide Impact

- **Keystatic admin route** (`/keystatic`): all schema changes will appear immediately after deploy. Existing YAML data must be migrated before editors use the admin (otherwise save will overwrite with empty image field values).
- **Static builds**: `getStaticProps` calls `reader.singletons.*.read()` — document fields add an extra `await` call per singleton but do not add network requests.
- **`content/*.yaml` files**: Phase 2 image migration edits these files directly (strip `/images/` prefix). Phase 3 document field change creates new `.mdoc` files alongside the YAML.
- **No layout/nav/footer changes required.**

---

## Acceptance Criteria

- [x] `WobbleCard` component exists at `components/ui/WobbleCard.js` with mouse-tracked 3-D tilt using Framer Motion springs
- [x] Home Benefits section renders `WobbleCard` instead of `HoverEffect`; each of the 3 cards has a distinct gradient color
- [x] `CardHoverEffect` import is removed from `pages/index.js` (may keep file for potential reuse elsewhere)
- [x] `fields.image()` used for all image inputs in `keystatic.config.js`; image upload widget appears in Keystatic admin for ordination gallery, services procedures, and benefits
- [x] `content/ordination.yaml`, `content/home.yaml`, `content/services.yaml` migrated to filename-only image values (no `/images/` prefix)
- [x] All existing images still display correctly after migration
- [x] `about.bioText` (or equivalent renamed field) uses `fields.document()` with heading, bold, italic, bullet-list, and link formatting enabled
- [x] About page renders rich document content using `DocumentRenderer`
- [x] `extraSections` blocks field added to both `about` and `services` singletons; editor can add `paragraph`, `imageBlock`, or `highlight` blocks from Keystatic admin
- [x] `npm run build` passes with no errors
- [x] No regression on existing contact form, nav, or footer

---

## Success Metrics

- Editor can upload a new ordination photo directly from `/keystatic` without touching YAML or the file system manually
- Editor can add bold/italic/bulleted text to the About bio
- Editor can append a new paragraph section or image block to the About or Services page

---

## Dependencies & Risks

| Risk | Mitigation |
|---|---|
| Image field YAML migration misses a path | Run `npm run build` after migration; broken images show as 404 and Next.js warns |
| `fields.document()` format change removes existing `bioText` YAML value | Migrate content to new `.mdoc` file before merging to `main` |
| `fields.blocks()` API surface in v0.5.48 may differ slightly from docs | Check actual export from `@keystatic/core` before use; fall back to a typed array of objects if unavailable |
| WobbleCard perspective on mobile | Disable hover tilt on touch devices (detect `window.matchMedia('(hover: none)')`) |

---

## Implementation Files

| File | Action |
|---|---|
| `components/ui/WobbleCard.js` | **CREATE** — Framer Motion tilt card component |
| `pages/index.js` | **EDIT** — swap `HoverEffect` → `WobbleCard` grid |
| `keystatic.config.js` | **EDIT** — all image fields + document field + blocks |
| `content/home.yaml` | **EDIT** — strip `/images/` prefix from benefit img values |
| `content/ordination.yaml` | **EDIT** — strip `/images/` prefix from image src values |
| `content/services.yaml` | **EDIT** — strip `/images/` prefix from procedure img values |
| `content/about.mdoc` | **CREATE** — migrated bioText rich content (new document field) |
| `pages/about.js` | **EDIT** — render document with `DocumentRenderer` |
| `pages/services.js` | **EDIT** — render `extraSections` blocks |

---

## Sources & References

- Previous implementation: [`feat/keystatic-cms-aceternity-ui`](../plans/2026-03-12-001-feat-keystatic-cms-aceternity-ui-plan.md)
- Aceternity WobbleCard: https://ui.aceternity.com/components/wobble-card
- Keystatic `fields.image()`: https://keystatic.com/docs/fields/image
- Keystatic `fields.document()`: https://keystatic.com/docs/fields/document
- Keystatic `fields.blocks()`: https://keystatic.com/docs/fields/blocks
- Keystatic `DocumentRenderer`: https://keystatic.com/docs/document-renderer

---
status: done
priority: p1
issue_id: "002"
tags: [code-review, performance, core-web-vitals, lcp, next-image]
dependencies: []
---

# Add `priority` prop to above-fold hero images (LCP regression)

## Problem Statement

The two most prominent above-the-fold images on the site — the hero portrait on the Home page and the doctor portrait on the About page — are missing Next.js's `priority` prop. This causes the browser to lazy-load them, directly delaying Largest Contentful Paint (LCP) and degrading Core Web Vitals scores.

## Findings

- `pages/index.js` renders `/images/thomas.png` as a `300×400` `<Image>` at the top of the hero section — the dominant paint element on every viewport. No `priority` prop.
- `pages/about.js` renders `/images/about.jpeg` with `fill` as the very first content section. At mobile (`100vw`) this is the definitive LCP element. No `priority` prop.
- Without `priority`, Next.js emits `loading="lazy"` and omits the `<link rel="preload">` hint from `<head>`. The browser only discovers the image after the JS bundle executes, typically adding 1–3 seconds to LCP on slow connections.
- Both images are **always visible** with no conditional rendering — they are unconditional LCP candidates.

## Proposed Solutions

### Option 1: Add `priority` to both images

**Approach:** Add the `priority` boolean prop to each above-fold `<Image>` component.

```js
// pages/index.js — hero portrait
<Image
  src="/images/thomas.png"
  alt="Dr. Thomas Schöffmann"
  width={300}
  height={400}
  priority                    {/* ← ADD THIS */}
  className="object-cover rounded-xl shadow-xl"
/>

// pages/about.js — doctor portrait
<Image
  src="/images/about.jpeg"
  alt="Dr. Thomas Schöffmann"
  fill
  priority                    {/* ← ADD THIS */}
  className="object-cover object-top"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

**Pros:**
- Two-word change per file — minimal risk
- Eliminates lazy loading, adds preload hint to `<head>`
- Directly improves LCP score and Core Web Vitals

**Cons:**
- None

**Effort:** 5 minutes  
**Risk:** Low

## Recommended Action

Implement Option 1 immediately. Two files, two words.

## Technical Details

**Affected files:**
- `pages/index.js` — hero `<Image>` for `/images/thomas.png`
- `pages/about.js` — portrait `<Image>` for `/images/about.jpeg`

**What `priority` does in Next.js:**
- Adds `<link rel="preload" as="image" ...>` to `<head>`
- Sets `loading="eager"` on the `<img>` element
- Disables lazy decoding — browser fetches image in parallel with page resources

**Note:** Do not add `priority` to below-fold images (service procedure images, ordination gallery) — only use it for images that are definitively above the fold on first render.

## Acceptance Criteria

- [ ] `pages/index.js` hero `<Image>` has `priority` prop
- [ ] `pages/about.js` portrait `<Image>` has `priority` prop
- [ ] No `priority` added to images that are below the fold
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (performance-oracle agent)

**Actions:**
- Identified `/images/thomas.png` (index.js) and `/images/about.jpeg` (about.js) as above-fold LCP candidates
- Confirmed neither has `priority` prop
- Estimated 1–3 second LCP regression on slow connections

## Notes

- This is a standard Next.js best practice oversight — easy to miss during implementation
- Related: todo #014 (`next.config.js` AVIF format) would further improve image performance once this is fixed

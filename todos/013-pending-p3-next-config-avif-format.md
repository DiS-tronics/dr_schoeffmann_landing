---
status: done
priority: p3
issue_id: "013"
tags: [code-review, performance, next-image, avif, next-config]
dependencies: []
---

# Enable AVIF image format in `next.config.js`

## Problem Statement

`next.config.js` uses the default image optimization configuration, which only enables WebP. AVIF format (supported by ~90% of modern browsers including all Chrome, Firefox, and Edge versions) delivers 30–50% smaller files than WebP at equivalent visual quality. The site serves several large images (doctor portraits, procedure images) where this saving is meaningful.

## Proposed Solutions

### Option 1: Add AVIF to `images.formats`

```js
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
module.exports = nextConfig
```

**What this does:**
- Browsers that support AVIF receive AVIF-encoded images
- Browsers that support WebP (but not AVIF) receive WebP
- Older browsers receive the original JPEG/PNG
- Format negotiation happens via `Accept` header — no code changes needed in page components

**Pros:**
- One-line change
- ~30–50% bandwidth reduction for AVIF-capable browsers
- Benefits all pages: hero portraits, service procedure images, ordination gallery

**Cons:**
- AVIF encoding is slower (CPU-intensive) — Vercel Image Optimization handles this on-demand and caches results, so there's no build-time penalty

**Effort:** 2 minutes  
**Risk:** Very Low

## Recommended Action

Implement immediately — it's a one-line addition to `next.config.js`.

## Technical Details

**Affected files:**
- `next.config.js`

## Acceptance Criteria

- [ ] `next.config.js` includes `formats: ['image/avif', 'image/webp']`
- [ ] `npm run build` passes
- [ ] Browser network tab shows `image/avif` content-type for image requests from AVIF-capable browsers

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (performance-oracle agent)

**Actions:**
- Confirmed `next.config.js` uses default image config with no explicit formats
- Confirmed AVIF supported by ~90% of target audience (modern browsers)
- Estimated 30–50% bandwidth saving for image-heavy pages (services, ordination)

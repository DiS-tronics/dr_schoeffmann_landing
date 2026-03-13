---
status: done
priority: p3
issue_id: "012"
tags: [code-review, quality, images, utility, duplication]
dependencies: []
---

# Extract image path normalization into `lib/utils.js` utility

## Problem Statement

The image source normalization pattern `src.startsWith('/') ? src : \`/images/${src}\`` appears 4+ times across multiple pages. This duplication means any change to image storage (e.g. moving to a CDN, changing the public path) requires editing every page.

## Findings

Duplicated pattern found in:
- `pages/index.js` — benefits `b.img` 
- `pages/services.js` — `op.img` (×2: spineProcs, hipProcs) + `extraSections` imageBlock `section.image`
- `pages/about.js` — `extraSections` imageBlock `section.value.image` (currently broken — will use `section.image` after todo 001 fix)
- `pages/ordination.js` — gallery image `item.img`

All instances have the same contract: the CMS stores a bare filename like `benefits1.png`, but `<Image>` needs `/images/benefits1.png`. The normalizer also handles legacy paths that already start with `/`.

## Proposed Solutions

### Option 1: Add `resolveImageSrc` to `lib/utils.js`

**Approach:**

```js
// lib/utils.js
export function cn(...inputs) { return twMerge(clsx(inputs)) }

/**
 * Resolve a Keystatic image field value to a usable src path.
 * Keystatic fields.image() stores bare filenames (e.g. "thomas.png").
 * This converts them to the correct public path ("/images/thomas.png").
 * Paths that already start with "/" are returned as-is.
 */
export function resolveImageSrc(src) {
  if (!src) return null
  return src.startsWith('/') ? src : `/images/${src}`
}
```

**Usage in each page:**
```js
import { resolveImageSrc } from '../lib/utils'
// ...
<Image src={resolveImageSrc(b.img)} alt={b.title} ... />
// With null guard:
{b.img && <Image src={resolveImageSrc(b.img)} alt={b.title} ... />}
```

**Pros:**
- Single source of truth for image path logic
- Future CDN migration = change one function
- Eliminates ternary clutter at call sites
- Documents the "why" (Keystatic bare filename storage) in one place

**Cons:**
- Minor refactor across 4 files

**Effort:** 20 minutes  
**Risk:** Low

## Recommended Action

Implement Option 1 as a standalone polish commit. Can be combined with the null guard fixes (todo 007).

## Technical Details

**Affected files:**
- `lib/utils.js` — add `resolveImageSrc(src)` export
- `pages/index.js` — replace inline ternary
- `pages/services.js` — replace inline ternary (3 instances)
- `pages/about.js` — replace inline ternary in extraSections imageBlock (after todo 001 fix)
- `pages/ordination.js` — replace inline ternary

## Acceptance Criteria

- [ ] `resolveImageSrc` exported from `lib/utils.js`
- [ ] All inline `src.startsWith('/')` ternaries replaced with `resolveImageSrc(src)`
- [ ] `resolveImageSrc(null)` returns `null` (no crash)
- [ ] `resolveImageSrc('/images/foo.png')` returns `'/images/foo.png'` (pass-through)
- [ ] `resolveImageSrc('foo.png')` returns `'/images/foo.png'`
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (architecture-strategist agent)

**Actions:**
- Counted 4+ duplicate instances of the path normalization pattern
- Identified `lib/utils.js` as the appropriate home for this utility
- Confirmed consistent contract: null-safe, pass-through for `/`-paths, prefix bare filenames

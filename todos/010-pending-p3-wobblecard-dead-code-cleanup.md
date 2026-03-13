---
status: done
priority: p3
issue_id: "010"
tags: [code-review, quality, wobblecard, dead-code, framer-motion]
dependencies: ["008"]
---

# WobbleCard dead code cleanup: `'use client'`, shimmer overlay, `useRef`

## Problem Statement

`WobbleCard.js` contains three dead code elements that should be removed: a no-op `'use client'` directive (Pages Router doesn't support App Router directives), a permanently invisible shimmer overlay (uses `group-hover` without a `group` ancestor), and a `useRef` that can be replaced by `e.currentTarget`.

## Findings

**`'use client'` (no-op in Pages Router):**
- `'use client'` is an App Router directive. In Next.js Pages Router it is silently ignored.
- Its presence implies the component was authored against the wrong mental model and may confuse future contributors.

**Dead shimmer overlay:**
- `<div className="... group-hover:opacity-100" />` — the `group-hover` variant fires only when an ancestor element has the Tailwind `group` class. No ancestor carries `group`, so the shimmer overlay has been opacity-0 since it was created and produces no visual output.

**`useRef` replaceable by `e.currentTarget`:**
- `containerRef.current.getBoundingClientRect()` — this ref is only used in `handleMouseMove`, which is bound to that same element. `e.currentTarget.getBoundingClientRect()` returns identical results without the ref.

## Proposed Solutions

### Option 1: Clean up all three issues in one pass

**Approach (apply after todo 008 is resolved):**

```js
// components/ui/WobbleCard.js — after motion value refactor from todo 008
// 1. Remove: 'use client'
// 2. Remove: const containerRef = useRef(null) and ref={containerRef}
// 3. Remove: the shimmer <div> entirely
// 4. Use e.currentTarget in handleMouseMove

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { cn } from '../../lib/utils'

// No 'use client', no useRef, no useState
export function WobbleCard({ containerClassName, className, children }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()  // no ref needed
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0) }}
      style={{ perspective: 800 }}
      className={cn('relative rounded-2xl overflow-hidden cursor-default select-none', containerClassName)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('relative z-10 h-full w-full p-8', className)}
      >
        {children}
        {/* shimmer removed — group-hover had no group ancestor */}
      </motion.div>
    </motion.div>
  )
}
```

**Pros:**
- Removes 3 separate dead items in one commit
- Cleaner, smaller implementation

**Cons:**
- Should be done after todo 008 (or together with it)

**Effort:** 10 minutes (as part of todo 008)  
**Risk:** Low

## Recommended Action

Resolve together with todo 008 (WobbleCard motion value refactor). The changes are complementary.

## Technical Details

**Affected files:**
- `components/ui/WobbleCard.js`

**Dependency:** This todo should be resolved in the same commit as `008-pending-p2-wobblecard-mousemove-performance.md`

## Acceptance Criteria

- [ ] No `'use client'` directive in `WobbleCard.js`
- [ ] No `useRef` in `WobbleCard.js` (use `e.currentTarget` instead)
- [ ] Shimmer overlay `<div>` removed
- [ ] `npm run build` passes
- [ ] WobbleCard still animates correctly after cleanup

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (architecture-strategist + code-simplicity-reviewer agents)

**Actions:**
- Confirmed `'use client'` has no effect in Pages Router
- Confirmed shimmer uses `group-hover` without any `group` ancestor — permanently invisible
- Confirmed `useRef` is only used to call `.getBoundingClientRect()` inside `handleMouseMove`

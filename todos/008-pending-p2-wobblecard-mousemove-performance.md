---
status: done
priority: p2
issue_id: "008"
tags: [code-review, performance, framer-motion, wobblecard, mousemove]
dependencies: []
---

# Fix WobbleCard unthrottled `mousemove` state updates (120 React renders/sec)

## Problem Statement

`WobbleCard` uses `useState` to track mouse position and drives Framer Motion's `animate` prop from React state. Every `mousemove` event triggers `setMousePos`, which causes a full React re-render of the card and **all its children** (including any `<Image>` elements). At 120 Hz this produces ~120 React reconciliations per second per card. Three cards on the Home page = up to 360 reconciliations/sec during hover.

## Findings

- `components/ui/WobbleCard.js` — `onMouseMove` calls `setMousePos(...)` on every event
- `rotateX` and `rotateY` are passed as plain numbers to `animate={{ rotateX, rotateY }}` — they are **not** Framer Motion motion values, so the animation library cannot bypass React's render cycle
- Framer Motion's `animate` prop also schedules its own animation frame for each value change, meaning both React reconciliation AND Framer animation frames fire simultaneously
- A `useSpring` + `useMotionValue` pattern would bypass React entirely, as motion values update directly in the Framer Motion render loop without triggering React state

## Proposed Solutions

### Option 1: Replace React state with Framer Motion motion values

**Approach:** Use `useMotionValue` + `useSpring` + `useTransform` so all mouse tracking happens inside Framer's animation loop — zero React re-renders on `mousemove`.

```js
// components/ui/WobbleCard.js
import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { cn } from '../../lib/utils'

export function WobbleCard({ containerClassName, className, children }) {
  const containerRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800 }}
      className={cn('relative rounded-2xl overflow-hidden cursor-default select-none', containerClassName)}
    >
      <motion.div
        style={{ rotateX, rotateY, scale: 1, transformStyle: 'preserve-3d' }}
        className={cn('relative z-10 h-full w-full p-8', className)}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
```

**Key improvements:**
- Removes both `useState` calls and the `isHovering` state
- `useRef` still needed for the outer container, but `getBoundingClientRect()` moves to `e.currentTarget`
- `scale` hover effect removed in this approach (or can be driven by `useSpring` on a hover motion value)
- Zero React re-renders during mouse movement

**Pros:**
- Zero React reconciliations during mousemove
- Smooth animation at native frame rate
- Simpler component (fewer state variables)

**Cons:**
- Slightly different API for `scale` effect (needs separate `useSpring` or CSS transition)

**Effort:** 30 minutes  
**Risk:** Low

---

### Option 2: Simple CSS-only scaling + remove Framer Motion from WobbleCard

**Approach:** Replace the entire Framer Motion interaction with pure CSS transforms. Use `onMouseMove` only for the tilt (via inline style), with `transition: transform 0.15s ease` for smoothness.

```js
export function WobbleCard({ containerClassName, className, children }) {
  const [transform, setTransform] = useState('rotateX(0) rotateY(0)')
  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    setTransform(`rotateX(${rx}deg) rotateY(${ry}deg)`)
  }
  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={() => setTransform('rotateX(0) rotateY(0)')}
      style={{ perspective: 800 }} className={cn('...', containerClassName)}>
      <div style={{ transform, transition: 'transform 0.15s ease', transformStyle: 'preserve-3d' }}
        className={cn('relative z-10 h-full w-full p-8', className)}>
        {children}
      </div>
    </div>
  )
}
```

**Pros:**
- No Framer Motion dependency on this component
- Very simple

**Cons:**
- Still calls `setState` on every mousemove — same reconciliation issue
- CSS `transition` is less customizable than Framer springs

**Effort:** 20 minutes  
**Risk:** Low

## Recommended Action

Implement **Option 1** — use Framer Motion motion values. This correctly uses the library's intended low-level API and produces the smoothest result with zero React overhead.

## Technical Details

**Affected files:**
- `components/ui/WobbleCard.js`

**Related todos:**
- `011-pending-p3-wobblecard-dead-code-cleanup.md` — remove `'use client'` and dead shimmer overlay in same commit

**Also note:** `prefers-reduced-motion` media query should be respected per accessibility best practices. Framer Motion supports this via `useReducedMotion()`.

## Acceptance Criteria

- [ ] No `setMousePos` / `setState` calls on `mousemove`
- [ ] `rotateX`/`rotateY` are Framer Motion motion values (not React state)
- [ ] WobbleCard tilt animation is smooth and spring-physics-based
- [ ] `npm run build` passes
- [ ] Chrome DevTools Performance panel shows no React reconciliation during hover

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (performance-oracle agent)

**Actions:**
- Identified `setMousePos` on every mousemove
- Confirmed `animate={{ rotateX, rotateY }}` from state bypasses Framer's internal value optimisation
- Proposed motion value replacement

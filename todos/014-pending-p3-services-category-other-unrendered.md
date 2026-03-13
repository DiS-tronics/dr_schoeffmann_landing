---
status: done
priority: p3
issue_id: "014"
tags: [code-review, quality, services, keystatic, cms-coverage]
dependencies: []
---

# Services page: `category: 'other'` procedures are silently dropped

## Problem Statement

`pages/services.js` filters procedures into `spineProcs` (category=spine) and `hipProcs` (category=hip) and renders them in separate sections. Any procedure with `category: 'other'` is silently discarded — a CMS editor adding an "other" procedure will see it disappear on the live page with no error.

## Findings

```js
// pages/services.js — current filtering logic
const spineProcs  = procedures.filter(p => p.category === 'spine')
const hipProcs    = procedures.filter(p => p.category === 'hip')
// No collection for category === 'other'
// Render: only spineProcs and hipProcs sections are rendered
```

The Keystatic schema defines `category` as `fields.select({ options: ['spine', 'hip', 'other'] })`. The value `'other'` is a first-class citizen in the schema but has no render path in the page.

## Proposed Solutions

### Option 1: Add a third "Weitere Leistungen" section for `category: 'other'`

**Approach:**

```js
// pages/services.js
const spineProcs = procedures.filter(p => p.category === 'spine')
const hipProcs   = procedures.filter(p => p.category === 'hip')
const otherProcs = procedures.filter(p => p.category === 'other')

// Render (after hip section):
{otherProcs.length > 0 && (
  <section>
    <h2 className="text-2xl font-bold text-primary mb-6">Weitere Leistungen</h2>
    {/* same card layout as spineProcs / hipProcs */}
  </section>
)}
```

**Pros:**
- Every CMS procedure category has a render path
- No silent data loss
- Consistent with editorial expectations

**Cons:**
- Requires adding an `otherProcs` render block (copy of existing section markup)

**Effort:** 15 minutes  
**Risk:** Low

---

### Option 2: Remove `'other'` from the schema `category` options

**Approach:** In `keystatic.config.js`, change the category select to only offer `spine` and `hip`.

**Pros:**
- Prevents the data entry scenario entirely
- Simpler schema

**Cons:**
- Loses future extensibility
- If any content already exists with `category: 'other'`, it becomes orphaned content

**Effort:** 5 minutes  
**Risk:** Low

## Recommended Action

Implement **Option 1** — add a third render section. This is the least surprising behavior from a CMS editor's perspective.

## Technical Details

**Affected files:**
- `pages/services.js` — add `otherProcs` filter + conditional render section

## Acceptance Criteria

- [ ] `otherProcs` filter added for `category === 'other'`
- [ ] Conditional `Weitere Leistungen` section renders when `otherProcs.length > 0`
- [ ] Section uses the same card markup as spine/hip sections
- [ ] `npm run build` passes
- [ ] A test procedure with `category: 'other'` is visible on the services page

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (agent-native-reviewer + architecture-strategist agents)

**Actions:**
- Confirmed `category: 'other'` defined in schema with no corresponding render path
- Confirmed `spineProcs` and `hipProcs` are the only categories that render
- Identified silent data loss: any `category: 'other'` procedure disappears from published site

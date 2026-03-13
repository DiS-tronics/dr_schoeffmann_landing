---
status: done
priority: p2
issue_id: "007"
tags: [code-review, null-guard, services, keystatic, next-image]
dependencies: []
---

# Add null guard for `op.img` in `pages/services.js` (crash on optional image field)

## Problem Statement

`pages/services.js` calls `op.img.startsWith('/')` on every operative procedure item. `fields.image()` in Keystatic is nullable by default — the field is not marked `required` in the schema. If a CMS user adds a procedure without uploading an image, `op.img` will be `null`, and `null.startsWith('/')` throws a `TypeError` that crashes the build (`getStaticProps` failure).

## Findings

- `pages/services.js` lines ~73 and ~89 both contain: `<Image src={op.img.startsWith('/') ? op.img : `/images/${op.img}`} ...`
- `keystatic.config.js` — `operativeProcedures` schema uses `imgField('Bild')` which is `fields.image({ ... })` — no `validation: { isRequired: true }`
- The build succeeds **only** because current YAML data has images for all procedures
- Any CMS user adding a new procedure via Keystatic without uploading an image (e.g. for a draft entry) will cause the next deploy to fail with an obscure `TypeError`

## Proposed Solutions

### Option 1: Wrap `<Image>` in null guard (matching the pattern already used for benefits in `index.js`)

**Approach:** Wrap the `<Image>` block with `{op.img && (...)}`.

```js
// pages/services.js — both spineProcs.map() and hipProcs.map()
<div key={op.title} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
  {op.img && (
    <div className="relative h-64 bg-gray-50">
      <Image
        src={op.img.startsWith('/') ? op.img : `/images/${op.img}`}
        alt={op.title}
        fill
        className="object-contain p-2"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
    </div>
  )}
  <div className="p-4">
    <h4 className="font-semibold text-gray-900 mb-1">{op.title}</h4>
    <p className="text-gray-600 text-sm">{op.desc}</p>
  </div>
</div>
```

**Pros:**
- Direct fix paralleling how `pages/index.js` guards `{b.img && (...)}` for benefit images
- Card renders gracefully without an image (title + description shown)
- Matches the same guard pattern used for `extraSections` image blocks

**Cons:**
- None

**Effort:** 5 minutes  
**Risk:** Low

---

### Option 2: Mark `img` as required in Keystatic schema

**Approach:** Add `validation: { isRequired: true }` to `imgField()` in `operativeProcedures`.

**Pros:**
- Prevents CMS users from saving a procedure without an image

**Cons:**
- Keystatic may not enforce required validation on image fields in all UI states (unverified in v0.5.x)
- Doesn't protect against direct YAML edits

**Effort:** 5 minutes  
**Risk:** Low (but less reliable than a null guard)

## Recommended Action

Implement **both** Option 1 (null guard) AND Option 2 (schema required). Defense in depth — never rely solely on CMS UI validation.

## Technical Details

**Affected files:**
- `pages/services.js` — two `<Image>` blocks inside `spineProcs.map()` and `hipProcs.map()` (~lines 73, 89)

**Reference pattern:**
- `pages/index.js` — `{b.img && <Image ... />}` — same guard already used for benefits

## Acceptance Criteria

- [ ] `spineProcs.map()` image block wrapped in `{op.img && (...)}`
- [ ] `hipProcs.map()` image block wrapped in `{op.img && (...)}`
- [ ] Adding a procedure in Keystatic without an image does not crash the build
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (architecture-strategist agent)

**Actions:**
- Identified `op.img.startsWith('/')` called without null guard
- Confirmed `fields.image()` is nullable in Keystatic v0.5.x
- Noted that `pages/index.js` already uses the correct `{b.img && ...}` guard pattern

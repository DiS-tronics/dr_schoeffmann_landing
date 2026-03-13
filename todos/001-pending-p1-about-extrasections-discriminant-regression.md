---
status: done
priority: p1
issue_id: "001"
tags: [code-review, regression, keystatic, cms]
dependencies: []
---

# Fix `extraSections` renderer in `pages/about.js` using stale discriminant/value shape

## Problem Statement

Extra sections added via the Keystatic CMS admin on the About page are **completely invisible** in the rendered output. Every CMS-authored section silently evaluates to `null` in the render loop.

## Findings

- `keystatic.config.js` uses `fields.array(fields.object({ type: fields.select(), ... }))` — this produces flat data shape: `{ type: 'paragraph', heading: '...', text: '...' }`
- `pages/about.js` tests `section.discriminant === 'paragraph'` (the OLD `fields.blocks()` shape), which **never matches** the flat structure
- `pages/services.js` was correctly updated to use `section.type === 'paragraph'` and `section.heading` / `section.text` (flat) — confirming the About page is a copy-paste regression
- This regression is explicitly documented as a checklist item in `docs/solutions/runtime-errors/keystatic-blocks-schema-assertnever-crash.md`
- **Impact:** 100% of CMS-added extra sections on the About page are silently dropped. No error is thrown, making it very hard to detect without manual testing.

## Proposed Solutions

### Option 1: Port the correct renderer from `services.js` to `about.js`

**Approach:** Replace all `section.discriminant === 'X'` / `section.value.field` patterns with `section.type === 'X'` / `section.field` in the `extraSections.map()` block in `pages/about.js`.

```js
// BEFORE (broken — old blocks shape)
if (section.discriminant === 'paragraph') {
  return (
    <div key={idx}>
      {section.value.heading && <h3>{section.value.heading}</h3>}
      <p>{section.value.text}</p>
    </div>
  )
}

// AFTER (correct — flat fields.array shape, matching services.js)
if (section.type === 'paragraph') {
  return (
    <div key={idx}>
      {section.heading && <h3 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h3>}
      {section.text && <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.text}</p>}
    </div>
  )
}
if (section.type === 'imageBlock') {
  const src = section.image
  return (
    <figure key={idx} className="rounded-2xl overflow-hidden shadow-sm">
      {src && (
        <div className="relative w-full h-72">
          <Image
            src={src.startsWith('/') ? src : `/images/${src}`}
            alt={section.caption ?? ''}
            fill
            className="object-cover"
          />
        </div>
      )}
      {section.caption && (
        <figcaption className="px-4 py-2 text-sm text-gray-500 bg-gray-50">{section.caption}</figcaption>
      )}
    </figure>
  )
}
if (section.type === 'highlight') {
  return (
    <div key={idx} className="bg-blue-50 border-l-4 border-primary rounded-xl p-5">
      {section.text && <p className="text-gray-700 whitespace-pre-line">{section.text}</p>}
    </div>
  )
}
```

**Pros:**
- Minimal change — one block of about 40 lines
- Directly mirrors the proven `services.js` implementation

**Cons:**
- None

**Effort:** 15 minutes  
**Risk:** Low

## Recommended Action

Implement Option 1 immediately. This is a one-line-per-branch fix that unblocks the CMS editor for the About page.

## Technical Details

**Affected files:**
- `pages/about.js` — extraSections.map() render block (lines ~141–180)

**Reference implementation:**
- `pages/services.js` — extraSections.map() (lines ~153–193) — correct flat shape

**Related documentation:**
- `docs/solutions/runtime-errors/keystatic-blocks-schema-assertnever-crash.md` — prevention checklist step 3: "Flat data shape — consuming pages use `section.type` / `section.text`, NOT `section.discriminant` / `section.value`"

## Acceptance Criteria

- [ ] `extraSections.map()` in `pages/about.js` uses `section.type` (not `section.discriminant`)
- [ ] All field access uses flat shape: `section.heading`, `section.text`, `section.image`, `section.caption`
- [ ] All three section types (`paragraph`, `imageBlock`, `highlight`) render correctly
- [ ] Null guards present: `{section.heading && ...}`, `{section.text && ...}`, `{src && ...}`
- [ ] `npm run build` passes with no errors

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (architecture-strategist + agent-native-reviewer agents)

**Actions:**
- Confirmed `services.js` uses flat shape (correct) while `about.js` still uses discriminant/value (wrong)
- Cross-referenced with `docs/solutions/runtime-errors/keystatic-blocks-schema-assertnever-crash.md` — this regression was explicitly predicted in the solution doc's prevention checklist
- Confirmed no runtime error is thrown — sections simply return `null` silently

## Notes

- This is a direct regression from the `fields.blocks()` → `fields.array+object` migration
- The `services.js` renderer can be used as a reference implementation exactly

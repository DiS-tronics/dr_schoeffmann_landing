---
title: "Keystatic v0.5.x: fields.blocks() crashes admin with assertNever"
date: 2026-03-12
category: runtime-errors
tags:
  - keystatic
  - fields.blocks
  - assertnever
  - cms
  - next.js
problem_type: framework-incompatibility
components_affected:
  - keystatic.config.js
  - pages/about.js
  - pages/services.js
severity: high
status: resolved
related_issues: []
---

# Keystatic v0.5.x: `fields.blocks()` crashes admin with `assertNever`

## Problem

Visiting `/keystatic` after adding a `fields.blocks()` schema to `keystatic.config.js` immediately crashed the admin UI with:

```
Error: Expected never to be called, but received: {"heading":{"kind":"form","formKind":"slug",...}}
```

The admin page was completely unusable — white screen + console error on every load.

## Root Cause

`fields.blocks()` causes `assertNever` inside Keystatic's internal `collectDirectoriesUsedInSchemaInner` function (`@keystatic/core` v0.5.48). This function traverses the entire schema to collect image-field directory paths. When it encounters a `fields.text()` field (which has `formKind: "slug"`) nested inside a blocks definition, it hits an unhandled branch and throws.

**This is a bug in Keystatic v0.5.x** — `fields.blocks()` is advertised in the docs but broken whenever the blocks schema contains non-image child fields.

The broken schema looked like this:

```js
// BROKEN in v0.5.48 — crashes collectDirectoriesUsedInSchemaInner
const extraSectionsField = fields.blocks(
  {
    paragraph: {
      label: 'Textabschnitt',
      schema: { text: fields.text({ multiline: true }) },
    },
    imageBlock: {
      label: 'Bild mit Beschriftung',
      schema: {
        image: fields.image({ directory: 'public/images', publicPath: '/images/' }),
        caption: fields.text(),
      },
    },
    highlight: {
      label: 'Hinweisbox',
      schema: { text: fields.text({ multiline: true }) },
    },
  },
  { label: 'Sections' }
)
```

## Solution

Replace `fields.blocks()` with `fields.array(fields.object({ type: fields.select(), ...allFields }))`. Keystatic v0.5.x handles this pattern correctly (it is already used internally for other array fields containing images).

### Step 1 — Replace the schema definition in `keystatic.config.js`

```js
// WORKING replacement for fields.blocks() in Keystatic v0.5.x
const extraSectionsField = fields.array(
  fields.object({
    type: fields.select({
      label: 'Art der Sektion',
      options: [
        { label: 'Textabschnitt', value: 'paragraph' },
        { label: 'Bild mit Beschriftung', value: 'imageBlock' },
        { label: 'Hinweisbox', value: 'highlight' },
      ],
      defaultValue: 'paragraph',
    }),
    heading: fields.text({ label: 'Überschrift (optional)' }),
    text: fields.text({ label: 'Text', multiline: true }),
    image: fields.image({
      label: 'Bild',
      directory: 'public/images',
      publicPath: '/images/',
    }),
    caption: fields.text({ label: 'Beschriftung (optional)' }),
  }),
  {
    label: 'Zusätzliche Sektionen',
    itemLabel: (props) => props.fields.heading.value || props.fields.type.value,
  }
)
```

### Step 2 — Update rendering to use the flat data shape

`fields.blocks()` produces `{ discriminant: 'paragraph', value: { text: '...' } }`.  
`fields.array(fields.object())` produces a flat object: `{ type: 'paragraph', text: '...' }`.

Update every page that renders these sections:

```js
// pages/about.js and pages/services.js
{data.extraSections?.map((section, i) => {
  if (section.type === 'paragraph') return (
    <div key={i}>
      {section.heading && <h3>{section.heading}</h3>}
      <p>{section.text}</p>
    </div>
  )
  if (section.type === 'imageBlock') return (
    <figure key={i}>
      <Image
        src={section.image ? `/images/${section.image}` : ''}
        alt={section.caption || ''}
        width={800}
        height={450}
      />
      {section.caption && <figcaption>{section.caption}</figcaption>}
    </figure>
  )
  if (section.type === 'highlight') return (
    <div key={i} className="highlight-box">
      <p>{section.text}</p>
    </div>
  )
  return null
})}
```

## Prevention

### Never use `fields.blocks()` in Keystatic v0.5.x

Treat `fields.blocks()` as off-limits until a Keystatic release note explicitly marks it fixed for schemas containing `fields.text()` or other non-image field types.

**Default pattern for polymorphic content sections:**
```js
fields.array(
  fields.object({
    type: fields.select({ options: [...], defaultValue: '...' }),
    // all variant fields declared at top level
  })
)
```

### Code review checklist additions

- [ ] **No `fields.blocks()`** — flag immediately; require `fields.array(fields.object(...))` instead
- [ ] **Select options match renderer** — every `value` in the `type` select must have a corresponding branch in every consuming page
- [ ] **Flat data shape** — consuming pages use `section.type` / `section.text`, NOT `section.discriminant` / `section.value`
- [ ] **Default values present** — every `fields.select()` must have a `defaultValue`

### Upgrade path

When upgrading Keystatic, check the changelog for `blocks`, `assertNever`, or `collectDirectoriesUsedInSchemaInner`. Before migrating back to `fields.blocks()`:

1. Create a throwaway singleton with `fields.blocks()` containing a `fields.text()` child
2. Load the admin locally and confirm no crash
3. Only then migrate production schemas

Pin Keystatic to an exact version in `package.json` to prevent silent upgrades from breaking schema compatibility.

### Test after any schema change

1. Navigate to every affected collection/singleton in `/keystatic` — confirm no crash
2. Save a record with new fields populated, confirm `.yaml` file is correct
3. Run `next build` to catch static generation errors

## Related

- **Origin plan (Keystatic integration):** `docs/plans/2026-03-12-001-feat-keystatic-cms-aceternity-ui-plan.md`
- **Plan that introduced `fields.blocks()` with a predicted risk note:** `docs/plans/2026-03-12-002-feat-wobble-card-rich-cms-editing-plan.md` — Risk section predicted this exact fallback
- **Fix location:** `keystatic.config.js` — `extraSectionsField` definition
- **Consuming pages updated:** `pages/about.js`, `pages/services.js`
- **Affected version:** `@keystatic/core` v0.5.48 (see `package.json`)
- **See also:** [`docs/solutions/ui-bugs/keystatic-admin-layout-scroll-blocked.md`](../ui-bugs/keystatic-admin-layout-scroll-blocked.md) — companion fix from the same session

---
status: done
priority: p3
issue_id: "011"
tags: [code-review, quality, about, keystatic, cms-coverage]
dependencies: []
---

# Fix orphaned `specializations` schema field — render it or remove it

## Problem Statement

The `specializations` array field is fully defined in the Keystatic `about` singleton schema but is never read or rendered in `pages/about.js`. An editor populating this field in the CMS admin will see no visual result — a broken editorial experience.

Meanwhile, `pages/about.js` renders a hardcoded "Klinische Schwerpunkte" box with static text that should logically be driven by this field.

## Findings

- `keystatic.config.js` defines `specializations: fields.array(fields.object({ label: fields.text(...) }), ...)` in the `about` schema
- `pages/about.js` destructures `about.education`, `about.career`, `about.memberships`, `about.extraSections` — but never `about.specializations`
- `pages/about.js` contains a hardcoded `<div>` with heading "Klinische Schwerpunkte" and text "Konservative und operative Wirbelsäulenchirurgie sowie Hüftendoprothetik" — this is the logical rendering target for `specializations`

## Proposed Solutions

### Option 1: Wire `specializations` to the hardcoded "Klinische Schwerpunkte" box

**Approach:** Replace the hardcoded text block with a rendered list from `about.specializations`.

```js
// pages/about.js — inside getStaticProps
// specializations is already in the `about` object (no special handling needed)

// pages/about.js — render
const specializations = about?.specializations ?? []

// Replace hardcoded block:
{specializations.length > 0 && (
  <div className="bg-blue-50 rounded-xl p-5">
    <h3 className="text-lg font-semibold text-primary mb-2">Klinische Schwerpunkte</h3>
    <ul className="space-y-1">
      {specializations.map(s => (
        <li key={s.label} className="flex items-center gap-2 text-gray-700">
          <span className="text-accent">▸</span> {s.label}
        </li>
      ))}
    </ul>
  </div>
)}
```

**Update `content/about.mdoc` frontmatter:**
```yaml
specializations:
  - label: Konservative und operative Wirbelsäulenchirurgie
  - label: Hüftendoprothetik (AMIS-Technik)
  - label: Schmerztherapie
```

**Pros:**
- CMS-editable specializations list
- Removes hardcoded text
- Schema field gets its intended rendering

**Cons:**
- Requires updating content/about.mdoc

**Effort:** 20 minutes  
**Risk:** Low

---

### Option 2: Remove `specializations` from the schema

**Approach:** Delete the dead field from `keystatic.config.js` and keep the hardcoded box.

**Pros:**
- Immediate cleanup
- No content migration needed

**Cons:**
- Loses potential CMS-editability of the specializations section
- Doesn't address the hardcoded content problem

**Effort:** 5 minutes  
**Risk:** Low

## Recommended Action

Implement **Option 1** — wire the field to its intended UI and populate initial values in the content file.

## Technical Details

**Affected files:**
- `pages/about.js` — add `specializations` destructure + replace hardcoded block
- `content/about.mdoc` — add initial entries to `specializations` array
- No schema changes needed — field is already defined correctly

## Acceptance Criteria

- [ ] `about.specializations` is destructured and rendered in `pages/about.js`
- [ ] Hardcoded "Klinische Schwerpunkte" text block replaced with CMS-driven list
- [ ] `content/about.mdoc` frontmatter has initial `specializations` entries
- [ ] Schema field `specializations` in `keystatic.config.js` is no longer orphaned
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (agent-native-reviewer + architecture-strategist agents)

**Actions:**
- Confirmed `specializations` defined in schema but destructuring absent in `about.js`
- Identified hardcoded "Klinische Schwerpunkte" box as intended rendering target
- Proposed wiring the field to the existing UI structure

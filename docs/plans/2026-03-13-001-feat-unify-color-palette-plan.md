---
title: "feat: Unify color palette across all pages and components"
type: feat
status: completed
date: 2026-03-13
origin: docs/brainstorms/2026-03-13-color-palette-unification-brainstorm.md
---

# feat: Unify color palette across all pages and components

## Overview

Replace the current ad-hoc color mix (saturated blue/teal/green gradients, disconnected cool-gray button hover, blue submit buttons) with a coherent warm-earth + muted-accent system across the entire site.

See brainstorm: [docs/brainstorms/2026-03-13-color-palette-unification-brainstorm.md](../brainstorms/2026-03-13-color-palette-unification-brainstorm.md)

---

## Acceptance Criteria

- [x] WobbleCard 1 ("Beste Versorgung") background: `#5582C8`
- [x] WobbleCard 2 ("Schmerztherapie vor Ort") background: `#51A39C`
- [x] WobbleCard 3 ("Ausführliche Aufklärung") background: `#6B556E`
- [x] All three WobbleCards use multi-step gradients, adjusted accordingingly to the new background color defined
- [x] New Tailwind token `btn-warm: '#898179'` added to `tailwind.config.js`
- [x] All primary CTA buttons: bg `#898179` (`btn-warm`), text `#DBD4CE` (`hero-beige`), hover bg `#5C5651` (`footer-brown`)
- [x] "Jetzt Termin anfragen ->" button in services, should be changed to "Jetzt Termin anfragen"
- [x] Contact form submit button "Nachricht senden": uses new button style (no more `bg-primary hover:bg-accent`)
- [x] Text links (`text-primary` / `hover:text-accent`) on contact page unchanged — keep blue for hyperlink convention
- [x] Build passes, no console errors

---

## Implementation

### 1. `tailwind.config.js`

Add `btn-warm` token. Optionally also add the three card colors as named tokens for IDE discoverability.

```js
colors: {
  primary: '#0F5BB5',
  accent: '#0B84FF',
  'footer-brown': '#5C5651',
  'hero-beige': '#DBD4CE',
  'banner-gray': '#92A1B7',
  'btn-warm': '#898179',          // ← ADD
  'card-blue':   '#5582C8',       // ← ADD (WobbleCard 1)
  'card-teal':   '#51A39C',       // ← ADD (WobbleCard 2)
  'card-purple': '#6B556E',       // ← ADD (WobbleCard 3)
},
```

### 2. `pages/index.js`

**WobbleCard colors** — replace gradient array (lines ~33–35) to corrected colors

**Hero CTA button "Weiterlesen"** — update hover (line ~69):

```jsx
// Before
className="inline-block bg-footer-brown text-hero-beige font-bold px-10 py-4 rounded-xl hover:bg-gray-700 transition-colors text-lg shadow-lg"

// After
className="inline-block bg-btn-warm text-hero-beige font-bold px-10 py-4 rounded-xl hover:bg-footer-brown transition-colors text-lg shadow-lg"
```

### 3. `components/ui/MovingBorder.js`

Update inner `<span>` background (line ~46):

```jsx
// Before
'relative inline-flex h-full w-full items-center justify-center rounded-[calc(0.75rem-1px)] bg-footer-brown text-hero-beige ...'

// After
'relative inline-flex h-full w-full items-center justify-center rounded-[calc(0.75rem-1px)] bg-btn-warm text-hero-beige ...'
```

### 4. `pages/services.js`

**Termin CTA button** (line ~199) — inside a `bg-banner-gray` section:

```jsx
// Before
className="inline-block bg-white text-banner-gray font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors"

// After
className="inline-block bg-btn-warm text-hero-beige font-bold px-8 py-3 rounded-xl hover:bg-footer-brown transition-colors"
```

**Termin CTA button** change text from "Jetzt Termin anfragen ->" to "Jetzt Termin anfragen"

### 5. `components/ContactForm.js`

**Submit button "Nachricht senden"** (line ~86):

```jsx
// Before
className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"

// After
className="w-full bg-btn-warm text-hero-beige font-semibold py-3 rounded-lg hover:bg-footer-brown transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
```

---

## Context

**Existing Tailwind tokens already correct (no change needed):**
- `bg-hero-beige` (`#DBD4CE`) — hero bg, page headers ✓
- `bg-footer-brown` / `text-footer-brown` (`#5C5651`) — footer, header font ✓
- `bg-banner-gray` (`#92A1B7`) — CTA/Termin banner ✓

**Not in scope:**
- Text links on contact page (`text-primary` / `hover:text-accent`) — keep blue by design
- Form field focus rings (`focus:ring-accent`) — small detail, not impactful
- Status colors (green success, red error in forms) — semantic, not design palette

## Sources

- **Origin brainstorm:** [docs/brainstorms/2026-03-13-color-palette-unification-brainstorm.md](../brainstorms/2026-03-13-color-palette-unification-brainstorm.md)
- Affected files: `tailwind.config.js`, `pages/index.js`, `components/ui/MovingBorder.js`, `pages/services.js`, `components/ContactForm.js`

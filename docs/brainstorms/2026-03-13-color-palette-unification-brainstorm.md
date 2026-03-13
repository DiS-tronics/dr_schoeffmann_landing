# Brainstorm: Color Palette Unification

**Date:** 2026-03-13  
**Status:** Ready for planning

---

## What We're Building

A unified color palette across the entire website, replacing the current mix of vibrant blues, saturated teal/green, and disconnected grays with a cohesive warm-earth + muted-accent system. Scope covers: hero section, nav bar, page headers, WobbleCard benefits cards, CTA buttons, the Termin/appointment banner, and the footer.

---

## Current State (Problems)

| Element | Current color(s) | Issue |
|---|---|---|
| WobbleCard 1 | `from-primary to-blue-800` (saturated blue gradient) | Too vivid, clashes with warm header |
| WobbleCard 2 | `from-teal-600 to-teal-900` (saturated teal gradient) | Too strong |
| WobbleCard 3 | `from-slate-600 to-slate-900` (cool dark slate gradient) | Disconnected from warm base |
| Hero CTA button "Weiterlesen" | `bg-footer-brown` + `hover:bg-gray-700` | hover color is unrelated cool gray |
| Contact "Jetzt Termin anfragen" button | `bg-footer-brown` + `hover:bg-gray-700` | same issue |
| Services CTA link-button | unstyled inline link | inconsistent |
| Links `text-primary` / `hover:text-accent` | `#0F5BB5` / `#0B84FF` | **intentional** — keep blue for text links (universal hyperlink cue) |

---

## Why This Approach

The site already has a correct warm-earth base palette defined in `tailwind.config.js`:

```js
colors: {
  primary: '#0F5BB5',        // blue — keep for text links only
  accent:  '#0B84FF',        // blue hover — keep for text links only
  'footer-brown': '#5C5651', // dark warm brown — header fonts, footer bg
  'hero-beige':   '#DBD4CE', // warm beige — hero bg, page header bg
  'banner-gray':  '#92A1B7', // muted blue-gray — Termin CTA banner bg
}
```

The infrastructure is already correct. What's broken is that WobbleCards and button hovers reach outside this palette into arbitrary Tailwind color utilities.

---

## Key Decisions

### 1. WobbleCard Colors — Replace Gradients with Flat Muted Solids

| Card | Old | New (flat) |
|---|---|---|
| Beste Versorgung | `from-primary to-blue-800` | `#5582C8` (muted medium blue) |
| Schmerztherapie vor Ort | `from-teal-600 to-teal-900` | `#51A39C` (muted teal) |
| Ausführliche Aufklärung | `from-slate-600 to-slate-900` | `#6B556E` (muted soft purple) |

These colors are desaturated/muted versions of the originals — still distinguishable, but no longer competing with the warm beige/brown base.

The gradient approach is fine and should stay with according colors.

### 2. Button Color — New mid-tone warm-brown token

A new Tailwind color token `btn-warm` = `#898179` (mid-tone warm gray-brown):

| State | Color |
|---|---|
| Default bg | `#898179` |
| Text | `#DBD4CE` (hero-beige) |
| Hover bg | `#5C5651` (footer-brown, darker) |

This applies to all primary CTA buttons:
- Hero "Weiterlesen"
- Services "Jetzt Termin anfragen →"
- The `MovingBorder` CTA inner span (already uses `bg-footer-brown` + `text-hero-beige` — shift bg to `btn-warm`)

### 3. Text Links — Keep Blue

`text-primary` (`#0F5BB5`) / `hover:text-accent` (`#0B84FF`) stays on inline text links (phone, email, legal URLs on contact page). Blue is a universal hyperlink convention and aids accessibility.

### 4. Page Header Backgrounds & Fonts

All page `<header>` banner sections already use `bg-hero-beige` + `text-footer-brown`. No change needed.

### 5. Footer

Already uses `bg-footer-brown`. No change needed.

### 6. Services "intro box"

Currently `bg-blue-50` (faint blue). Should shift to `bg-hero-beige/40` (faint warm beige) to remove the last blue background from the page.

---

## Files to Change

| File | Change |
|---|---|
| `tailwind.config.js` | Add `'btn-warm': '#898179'` and three WobbleCard named colors |
| `pages/index.js` | Replace `wobbleGradients` array with new flat colors; update hero button hover |
| `components/ui/MovingBorder.js` | Update inner span bg from `bg-footer-brown` to `bg-btn-warm` |
| `pages/services.js` | Update intro box from `bg-blue-50` → `bg-[#DBD4CE]/30`; update CTA link button style |
| `pages/contact.js` | Update submit/CTA button style if present |
| `components/ContactForm.js` | Update submit button style |

---

## Open Questions

_None — all decisions resolved during dialogue._

---

## Resolved Questions

- **WobbleCard direction?** → Muted & differentiated: `#5582C8`, `#51A39C`, `#6B556E`
- **Button color?** → New mid-tone: bg `#898179`, text `#DBD4CE`, hover `#5C5651`
- **Text links?** → Keep blue (accessibility + convention)

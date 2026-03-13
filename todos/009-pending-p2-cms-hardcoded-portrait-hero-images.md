---
status: done
priority: p2
issue_id: "009"
tags: [code-review, cms, keystatic, hardcoded-content, agent-native]
dependencies: []
---

# Make portrait images CMS-editable (hero + about page hardcoded paths)

## Problem Statement

Two images that are central to the medical practice's brand identity — the doctor's portrait on the Home page hero and the About page — are hardcoded paths in JSX. A site owner cannot change these images through the Keystatic admin without making a code change. This is a significant CMS coverage gap for a site where the CMS is the primary editing interface.

## Findings

- `pages/index.js` — `src="/images/thomas.png"` hardcoded; `home` Keystatic singleton has no portrait/hero image field
- `pages/about.js` — `src="/images/about.jpeg"` hardcoded; `about` Keystatic singleton has no portrait image field
- The `home` singleton has `benefits[].img` (array of benefit card images) but no top-level hero image
- The `about` singleton has `bioContent`, `education`, `career`, `specializations`, `memberships`, `extraSections` — but no portrait

**Also found (mapEmbedUrl — same pattern):**
- `pages/contact.js` — Google Maps `<iframe src>` is hardcoded; `contact` Keystatic singleton has `mapEmbedUrl: fields.url(...)` defined but never read in the page
- Contact page ignores `contact?.mapEmbedUrl` entirely

## Proposed Solutions

### Option 1: Add portrait image fields to `home` and `about` singletons

**Approach:**

**Step 1 — `keystatic.config.js`:**
```js
// home singleton
schema: {
  heroTitle: ...,
  heroSubtitle: ...,
  heroPortrait: imgField('Arztbild (Startseite)'),   // ← ADD
  // ...
}

// about singleton
schema: {
  pageTitle: ...,
  pageSubtitle: ...,
  portrait: imgField('Portraitbild'),                 // ← ADD
  // ...
}
```

**Step 2 — `pages/index.js`:**
```js
const heroPortrait = home?.heroPortrait
// ...
{heroPortrait && (
  <Image
    src={heroPortrait.startsWith('/') ? heroPortrait : `/images/${heroPortrait}`}
    alt="Dr. Thomas Schöffmann"
    width={300}
    height={400}
    priority
    className="object-cover rounded-xl shadow-xl"
  />
)}
// Fallback: keep src="/images/thomas.png" as explicit fallback if field is empty
```

**Step 3 — `pages/about.js`:**
```js
const portrait = about?.portrait
// ...
<Image
  src={portrait ? (portrait.startsWith('/') ? portrait : `/images/${portrait}`) : '/images/about.jpeg'}
  alt="Dr. Thomas Schöffmann"
  fill
  priority
  className="object-cover object-top"
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

**Step 4 — Fix `mapEmbedUrl` in `pages/contact.js`:**
```js
const mapEmbedUrl = contact?.mapEmbedUrl
// In JSX:
{mapEmbedUrl ? (
  <iframe src={mapEmbedUrl} ... title="Ordinationsstandort Karte" />
) : (
  // Existing hardcoded iframe as fallback
  <iframe src="..." ... />
)}
```

**Pros:**
- Site owner can update all key images without a code deploy
- Complete agent-native parity — all visible images are CMS-driven
- Backward-compatible: existing image files act as fallbacks

**Cons:**
- Requires updating YAML content files to add the new field values
- Slightly more complex image resolution logic per image

**Effort:** 45 minutes  
**Risk:** Low

## Recommended Action

Implement Option 1, covering both portrait images and the mapEmbedUrl fix in one commit.

## Technical Details

**Affected files:**
- `keystatic.config.js` — add `heroPortrait` to `home`, `portrait` to `about`
- `pages/index.js` — use `home.heroPortrait` with `/images/thomas.png` fallback
- `pages/about.js` — use `about.portrait` with `/images/about.jpeg` fallback
- `pages/contact.js` — use `contact.mapEmbedUrl` for iframe `src`
- `content/home.yaml` — add `heroPortrait:` entry
- `content/about.mdoc` — add `portrait:` to frontmatter

## Acceptance Criteria

- [ ] Home page hero portrait can be changed via Keystatic admin
- [ ] About page doctor portrait can be changed via Keystatic admin
- [ ] Contact page map URL can be changed via Keystatic admin
- [ ] Existing images still appear as fallback when CMS fields are empty
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (agent-native-reviewer + architecture-strategist agents)

**Actions:**
- Identified hardcoded `/images/thomas.png` and `/images/about.jpeg`
- Confirmed `about` and `home` singletons have no portrait field
- Identified `mapEmbedUrl` field defined in schema but never read in `contact.js`

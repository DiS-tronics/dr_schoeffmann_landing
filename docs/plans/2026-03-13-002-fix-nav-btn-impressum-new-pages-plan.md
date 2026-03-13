---
title: "fix: Nav mobile button color, Impressum CMS editing, Keystatic new-page support"
type: fix
status: completed
date: 2026-03-13
---

# fix: Nav mobile button color, Impressum CMS editing, Keystatic new-page support

## Overview

Three separate but related polish issues:

1. **Mobile nav CTA color** — "Termin vereinbaren" in the hamburger menu uses the old blue `bg-primary hover:bg-accent` colors instead of the unified warm-brown `bg-btn-warm` established during the color-palette unification.
2. **Impressum not editable in Keystatic** — The Impressum section is hardcoded in `pages/contact.js`. The Impressum belongs to the contact page, so its editable fields should live in the existing `contact` singleton and `content/contact.yaml` — not in a separate singleton.
3. **No way to add new pages in Keystatic** — All CMS entries are fixed singletons. Editors cannot create ad-hoc pages (e.g. Datenschutz, FAQ) without touching source code.

---

## Relevant Files

- `components/Nav.js` — mobile menu "Termin vereinbaren" button (around line 76)
- `keystatic.config.js` — all singleton definitions; no collection defined
- `pages/contact.js` — Impressum section is hardcoded (line 124 ff.)
- `tailwind.config.js` — `btn-warm: '#898179'` already defined

---

## Acceptance Criteria

### 1 – Mobile nav button color

- [x] The "Termin vereinbaren" `<Link>` in the mobile (`md:hidden`) menu uses `bg-btn-warm text-white hover:bg-footer-brown` (no more `bg-primary hover:bg-accent`)
- [x] Desktop nav is unchanged
- [x] Color matches all other CTA buttons site-wide

### 2 – Impressum editable in Keystatic

- [x] New Impressum fields are added to the existing `contact` singleton schema in `keystatic.config.js` (no new singleton)
- [x] Fields to add: `impressumDoctorName`, `impressumHomepage`, `impressumMembership`, `impressumProfession`, `impressumLegalNote`
- [x] `content/contact.yaml` is populated with the current hardcoded values for all new fields
- [x] `pages/contact.js` reads the new fields from the `contact` prop (already fetched in `getStaticProps`) and renders them in place of the hardcoded strings
- [x] No fallbacks needed — fields are always populated via the CMS

### 3 – Add new pages via Keystatic dashboard

- [x] A `pages` **collection** is added to `keystatic.config.js` using `collection()` from `@keystatic/core`
- [x] Each entry has: `title` (text), `slug` (auto-derived from entry key), `content` (document field with formatting)
- [x] A catch-all Next.js page `pages/[slug].js` renders collection entries (reads via `createReader()`)
- [x] `getStaticPaths` generates paths for all existing collection entries
- [x] The new page is linked in the Nav only if an editor explicitly adds it to the nav links — no automatic injection needed for now
- [x] Build passes, no TypeScript/lint errors

---

## Implementation Plan

### Step 1 — `components/Nav.js`: fix mobile CTA button

Locate the mobile menu "Termin vereinbaren" `<Link>` (currently `bg-primary text-white … hover:bg-accent`).

Replace with:
```jsx
className="block bg-btn-warm text-white text-sm font-medium px-4 py-2 rounded text-center mt-2 hover:bg-footer-brown transition-colors"
```

### Step 2 — `keystatic.config.js`: extend `contact` singleton with Impressum fields

The Impressum content belongs to the contact page, so its fields are added directly to the existing `contact` singleton. Currently hardcoded in `pages/contact.js` Impressum section:

| Hardcoded value | New CMS field |
|---|---|
| `"Dr. Thomas Schöffmann"` | `impressumDoctorName` |
| `"www.dr-schoeffmann.at"` | `impressumHomepage` |
| `"Mitglied der Ärztekammer für Kärnten"` | `impressumMembership` |
| `"Facharzt für Orthopädie und Traumatologie (verliehen in Österreich)"` | `impressumProfession` |
| Paragraph about Ärztegesetz 1998 | `impressumLegalNote` (multiline) |

Note: `address`, `phone`, `email` are already read from the CMS `contact` singleton — no changes needed there.

Add to the `contact` singleton schema in `keystatic.config.js`:

```js
contact: singleton({
  label: 'Kontakt',
  path: 'content/contact',
  format: { data: 'yaml' },
  schema: {
    // …existing fields (address, phone, email, hours, arrivalInfo, mapEmbedUrl)…

    // Impressum
    impressumDoctorName:  fields.text({ label: 'Impressum – Name des Arztes' }),
    impressumHomepage:    fields.text({ label: 'Impressum – Homepage (ohne https://)' }),
    impressumMembership:  fields.text({ label: 'Impressum – Kammermitgliedschaft', multiline: true }),
    impressumProfession:  fields.text({ label: 'Impressum – Berufsbezeichnung' }),
    impressumLegalNote:   fields.text({ label: 'Impressum – Rechtlicher Hinweis (Ärztegesetz etc.)', multiline: true }),
  },
}),
```

### Step 3 — `content/contact.yaml`: seed Impressum values

Add the currently hardcoded values as initial data so the CMS is immediately populated:

```yaml
# …existing fields…
impressumDoctorName: "Dr. Thomas Schöffmann"
impressumHomepage: "www.dr-schoeffmann.at"
impressumMembership: "Mitglied der Ärztekammer für Kärnten"
impressumProfession: "Facharzt für Orthopädie und Traumatologie (verliehen in Österreich)"
impressumLegalNote: "Tätigkeit unterliegt dem Ärztegesetz 1998 (www.ris.bka.gv.at/bundesrecht)"
```

### Step 4 — `pages/contact.js`: replace hardcoded Impressum strings

The `contact` prop is already fetched in `getStaticProps`. Destructure the new fields and use them in the Impressum JSX:

```js
const impressumDoctorName = contact.impressumDoctorName
const impressumHomepage   = contact.impressumHomepage
const impressumMembership = contact.impressumMembership
const impressumProfession = contact.impressumProfession
const impressumLegalNote  = contact.impressumLegalNote
```

Replace the hardcoded Impressum section (lines ~124 ff.) with:

```jsx
{/* Impressum */}
<section id="impressum" className="py-12 bg-gray-50 border-t border-gray-200 scroll-mt-12">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Impressum</h2>
    <div className="text-gray-600 text-sm space-y-2 prose-content">
      <p>Information gemäß § 5 E-Commerce-Gesetz und Offenlegung gemäß § 25 Mediengesetz:</p>
      <p>
        <strong>Diensteanbieter und Medieninhaber:</strong><br />
        {impressumDoctorName}<br />
        {address}<br />
        Tel.: {phone}<br />
        E-Mail: {email}<br />
        Homepage: {impressumHomepage}
      </p>
      <p>{impressumMembership}<br />
      Berufsbezeichnung: {impressumProfession}</p>
      <p>{impressumLegalNote}</p>
    </div>
  </div>
</section>
### Step 5 — `keystatic.config.js`: add `pages` collection

Import `collection` (already available from `@keystatic/core`).

```js
collections: {
  pages: collection({
    label: 'Seiten',
    slugField: 'title',
    path: 'content/pages/*',
    format: { contentField: 'content' },
    schema: {
      title: fields.slug({ name: { label: 'Titel' } }),
      content: fields.document({
        label: 'Inhalt',
        formatting: {
          inlineMarks: { bold: true, italic: true, underline: true },
          listTypes: { ordered: true, unordered: true },
          headingLevels: [2, 3],
          blockTypes: { blockquote: true },
          softBreaks: true,
        },
        links: true,
      }),
    },
  }),
},
```

### Step 6 — `pages/[slug].js`: new catch-all page for collection entries

Create `pages/[slug].js`:

```js
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

export default function DynamicPage({ page }) {
  if (!page) return <p>Seite nicht gefunden.</p>
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 prose">
      <h1>{page.title}</h1>
      {/* render page.content via DocumentRenderer */}
    </main>
  )
}

export async function getStaticPaths() {
  const reader = createReader(process.cwd(), keystaticConfig)
  const slugs = await reader.collections.pages.list()
  return { paths: slugs.map(slug => ({ params: { slug } })), fallback: false }
}

export async function getStaticProps({ params }) {
  const reader = createReader(process.cwd(), keystaticConfig)
  const page = await reader.collections.pages.read(params.slug)
  return { props: { page: page ?? null } }
}
```

---

## Risk & Notes

- **`[slug].js` conflicts** — Ensure no existing pages (about, services, contact, ordination) clash with collection slugs. The dynamic route is a catch-all for unknown slugs only — named routes take precedence in Next.js.
- **`fields.slug`** — Available in Keystatic v0.5+. If the installed version doesn't support it, use `fields.text({ label: 'Titel' })` and derive the slug from the collection entry key.
- **Impressum data** — Seeding `content/contact.yaml` in Step 3 means no editor action is required; the dashboard will show the populated values immediately after the schema change is deployed.

---

## Sources & References

- `components/Nav.js` — mobile CTA button (line 76)
- `keystatic.config.js` — all existing singletons
- `pages/contact.js` — hardcoded Impressum (line 124 ff.)
- `tailwind.config.js` — `btn-warm` and `footer-brown` token definitions
- Related todo: `todos/015-pending-p3-contact-impressum-hardcoded.md`

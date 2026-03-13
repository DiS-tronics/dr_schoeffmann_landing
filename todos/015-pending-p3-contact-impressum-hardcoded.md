---
status: done
priority: p3
issue_id: "015"
tags: [code-review, quality, contact, keystatic, cms-coverage, agent-native]
dependencies: []
---

# Contact page Impressum duplicates CMS data as hardcoded strings

## Problem Statement

The Impressum (legal notice) section in `pages/contact.js` contains several pieces of information (address, phone, email, license authority) as hardcoded string literals. These duplicate fields already present in the `contact` Keystatic singleton, meaning a CMS editor who updates contact information must know to update both the CMS content AND the Impressum in source code. This is a classic CMS-coverage gap.

Additionally, the `contact.mapEmbedUrl` CMS field is defined in the Keystatic schema but the page hardcodes the `<iframe src="...">` instead of reading the CMS field — so the map location cannot be changed through the CMS admin.

## Findings

- `pages/contact.js` renders an `<iframe src="HARDCODED_MAP_URL">` — never reads `contact?.mapEmbedUrl`
- `pages/contact.js` Impressum section contains hardcoded: address, city, phone, email, medical board/authority info
- The `contact` singleton in `keystatic.config.js` defines: `address`, `phone`, `email`, `mapEmbedUrl` 
- A CMS editor who updates `phone` through the admin will see the update on the contact info card but NOT in the Impressum

## Proposed Solutions

### Option 1: Use CMS fields in both map + Impressum

**Approach:**

```js
// pages/contact.js — hook up mapEmbedUrl + Impressum fields to CMS

// In render:

// Map section — replace hardcoded src:
{contact?.mapEmbedUrl && (
  <iframe
    src={contact.mapEmbedUrl}
    width="100%"
    height="300"
    className="rounded-xl border-0"
    allowFullScreen
    loading="lazy"
    title="Standort Ordination"
  />
)}

// Impressum section — replace hardcoded strings:
<address className="not-italic text-sm text-gray-600 space-y-1">
  <p>Dr. Thomas Schöffmann</p>
  <p>{contact?.address}</p>
  <p>Tel: {contact?.phone}</p>
  <p>E-Mail: {contact?.email}</p>
</address>
```

**Add `mapEmbedUrl` to `content/contact.mdoc` frontmatter:**
```yaml
mapEmbedUrl: "https://www.google.com/maps/embed?..."
```

**Pros:**
- CMS is the single source of truth for all contact data
- Agent-native: an agent can update the map and Impressum through normal CMS writes
- Eliminates the "contact info drift" problem

**Cons:**
- Requires adding `mapEmbedUrl` initial value to content file

**Effort:** 20 minutes  
**Risk:** Low — purely additive rendering change

---

### Option 2: Add Impressum-specific fields to the schema

If the Impressum needs fields that differ from contact card fields (e.g. separate legal entity name, UID number), add them to the schema:

```js
// keystatic.config.js — extend contact schema
impressumExtra: fields.object({
  legalName: fields.text({ label: 'Vollständige Firmenbezeichnung' }),
  uid: fields.text({ label: 'UID-Nummer (optional)', validation: { isRequired: false } }),
  authority: fields.text({ label: 'Aufsichtsbehörde' }),
})
```

**Pros:**
- Covers legal fields unique to the Impressum
- Structured for completeness

**Cons:**
- More schema work; may be overkill for a solo practice site

**Effort:** 30 minutes  
**Risk:** Low

## Recommended Action

Start with **Option 1** — use existing CMS fields. Add Option 2 fields only if Impressum requires distinct legal text beyond phone/address/email.

## Technical Details

**Affected files:**
- `pages/contact.js` — hook up `contact.mapEmbedUrl` to iframe `src`; replace Impressum hardcoded strings with CMS fields
- `content/contact.mdoc` — add `mapEmbedUrl` frontmatter entry with current embed URL

**Security note:** `mapEmbedUrl` should be sanitized before use in an `<iframe src>` to prevent XSS. Consider allowing only `https://www.google.com/maps/embed` prefix:
```js
const ALLOWED_MAP_PREFIX = 'https://www.google.com/maps/embed'
const safeMapUrl = contact?.mapEmbedUrl?.startsWith(ALLOWED_MAP_PREFIX)
  ? contact.mapEmbedUrl
  : null
```

## Acceptance Criteria

- [ ] `contact.mapEmbedUrl` drives the `<iframe>` map embed (no hardcoded URL)
- [ ] Impressum address/phone/email read from CMS `contact` singleton
- [ ] `content/contact.mdoc` has `mapEmbedUrl` set to the current Google Maps embed URL
- [ ] Map embed URL is validated against allowed prefix before use in `<iframe>`
- [ ] `npm run build` passes
- [ ] Changing `phone` in Keystatic admin updates both the contact card AND the Impressum

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (agent-native-reviewer agent)

**Actions:**
- Confirmed `mapEmbedUrl` defined in schema, never read in page
- Confirmed Impressum uses hardcoded strings that duplicate CMS-editable fields
- Identified security note: map URL should be origin-validated before `<iframe>` use

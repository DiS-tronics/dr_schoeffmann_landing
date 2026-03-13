---
status: done
priority: p2
issue_id: "004"
tags: [code-review, security, gdpr, dsgvo, input-validation, contact-api]
dependencies: ["003"]
---

# Contact API: remove PII from logs + add server-side input validation

## Problem Statement

The `/api/contact` handler has two security/compliance issues:
1. It logs full PII (name, email, phone, message) to `console.log`, which on Vercel persists in plaintext logs — a GDPR/DSGVO violation for an Austrian medical practice.
2. All input validation exists only in the client-side `ContactForm.js`, making it trivially bypassed via `curl` or any HTTP tool. An attacker can send arbitrarily large payloads or malformed data.

## Findings

**PII logging:**
- `console.log('Kontaktformular:', { name, email, phone, message, timestamp })` — line 13 of `pages/api/contact.js`
- Vercel log aggregation retains this data for 14 days (longer on Pro) with no encryption at rest on Vercel's side
- Under DSGVO Article 32, medical practitioners must implement "appropriate technical measures" to protect personal data — unencrypted log persistence of patient contact data fails this bar

**No server-side validation:**
- Client-side regex and length checks in `ContactForm.js` are the only guards
- `curl -X POST /api/contact -H 'Content-Type: application/json' -d '{"name":"x","email":"notanemail","message":"y"}'` passes all server checks
- 100 MB `message` payload accepted, logged, and forwarded to webhook
- `phone: null.toString()` would crash the handler (potential 500 error)

## Proposed Solutions

### Option 1: Replace PII log + add server-side validation guards

**Approach:** Remove the PII log and add explicit type/length/format checks before business logic.

```js
// pages/api/contact.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, message } = req.body ?? {}

  // Server-side validation (mirrors client-side, not trusts it)
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (typeof name !== 'string' || !name.trim() || name.length > 200) {
    return res.status(400).json({ error: 'Ungültiger Name' })
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' })
  }
  if (typeof message !== 'string' || !message.trim() || message.length > 5000) {
    return res.status(400).json({ error: 'Ungültige Nachricht' })
  }
  if (phone !== undefined && phone !== null && (typeof phone !== 'string' || phone.length > 50)) {
    return res.status(400).json({ error: 'Ungültige Telefonnummer' })
  }

  // Non-PII log only (DSGVO-safe)
  console.log('Contact form submission received', {
    timestamp: new Date().toISOString(),
    hasPhone: !!phone,
    messageLength: message.length,
  })

  if (process.env.CONTACT_WEBHOOK) {
    // ... webhook call (see todo 005 for URL validation)
    fetch(process.env.CONTACT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone?.trim(), message: message.trim() }),
    }).catch(err => console.error('Webhook error:', err))
  }

  return res.status(200).json({ ok: true })
}
```

**Pros:**
- Eliminates GDPR exposure from logs
- Prevents oversized payloads and malformed data
- Hardens against curl-based probing

**Cons:**
- Slightly more code

**Effort:** 20 minutes  
**Risk:** Low

## Recommended Action

Implement Option 1. Remove PII log and add server-side validation together — they're in the same function.

## Technical Details

**Affected files:**
- `pages/api/contact.js`

**Related todos:**
- `003-pending-p1-contact-api-no-rate-limiting.md` — same endpoint, should be done together
- `005-pending-p2-contact-webhook-url-validation.md` — SSRF fix for the webhook call

## Acceptance Criteria

- [ ] `console.log` in `/api/contact` contains no PII (no name, email, phone, message content)
- [ ] Server-side validation rejects: missing fields, email not matching regex, name > 200 chars, message > 5000 chars
- [ ] `curl -X POST` without Content-Type or with oversized body returns 400
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (security-sentinel agent)

**Actions:**
- Identified PII in console.log (DSGVO/GDPR concern for Austrian medical practice)
- Confirmed all validation is client-side only
- Drafted server-side validation + non-PII log replacement

## Notes

- DSGVO reference: Austrian Datenschutzbehörde has issued fines for unencrypted PII in logs
- The webhook fix (todo 005) should be applied in the same commit as this

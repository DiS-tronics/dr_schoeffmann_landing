---
status: done
priority: p2
issue_id: "005"
tags: [code-review, security, ssrf, webhook, contact-api]
dependencies: []
---

# Validate CONTACT_WEBHOOK URL before forwarding PII (SSRF + uncontrolled egress)

## Problem Statement

The `CONTACT_WEBHOOK` environment variable is used in `pages/api/contact.js` to forward contact form submissions with zero URL validation. If misconfigured (HTTP instead of HTTPS, wrong domain, internal service URL, or test endpoint), patient names, email addresses, and phone numbers are silently forwarded to an unintended destination.

## Findings

- `fetch(process.env.CONTACT_WEBHOOK, { body: JSON.stringify({ name, email, phone, message }) })` — no URL validation whatsoever
- HTTP URL would expose PII in transit without TLS
- An internal URL (e.g. `http://169.254.169.254/...` AWS metadata endpoint) would constitute SSRF
- URL typos silently send data to wrong destinations with no error surfaced to the form user
- The `catch(err => console.error(...))` only logs the error — the 200 response is already sent, so the failure is invisible to the end user

## Proposed Solutions

### Option 1: Validate URL before use

**Approach:** Parse and validate the webhook URL at call-time.

```js
// pages/api/contact.js — webhook section
if (process.env.CONTACT_WEBHOOK) {
  let webhookUrl
  try {
    webhookUrl = new URL(process.env.CONTACT_WEBHOOK)
  } catch {
    console.error('CONTACT_WEBHOOK is not a valid URL — skipping webhook')
    webhookUrl = null
  }

  if (webhookUrl && webhookUrl.protocol === 'https:') {
    fetch(webhookUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message }),
    }).catch(err => console.error('Webhook error:', err))
  } else if (webhookUrl) {
    console.error('CONTACT_WEBHOOK must use https:// — webhook disabled for security')
  }
}
```

**Pros:**
- Prevents HTTP transmission of PII
- Guards against URL construction errors
- No external dependency

**Cons:**
- Does not prevent SSRF to valid HTTPS internal endpoints (rare on Vercel's network)

**Effort:** 10 minutes  
**Risk:** Low

---

### Option 2: Validate at app startup

**Approach:** Move the validation to module-level so a misconfigured `CONTACT_WEBHOOK` fails fast at deployment rather than silently at runtime.

```js
// pages/api/contact.js — module level
const WEBHOOK_URL = (() => {
  const raw = process.env.CONTACT_WEBHOOK
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:') throw new Error('must use https://')
    return raw
  } catch (e) {
    console.error(`Invalid CONTACT_WEBHOOK: ${e.message}`)
    return null
  }
})()
```

**Pros:**
- Fails fast — misconfiguration is visible at first request, not on first submission
- Cleaner handler code

**Cons:**
- Module-level code slightly harder to test

**Effort:** 10 minutes  
**Risk:** Low

## Recommended Action

Implement Option 2 (module-level validation). Can be combined with the todo 004 changes in one commit.

## Technical Details

**Affected files:**
- `pages/api/contact.js`

**Related todos:**
- `004-pending-p2-contact-api-pii-logging-input-validation.md` — complementary hardening
- `003-pending-p1-contact-api-no-rate-limiting.md` — same endpoint

## Acceptance Criteria

- [ ] Webhook is only called when URL starts with `https://`
- [ ] HTTP webhook URL logs an error and is silently skipped (no crash)
- [ ] Invalid URL (non-parseable) logs an error and is silently skipped
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (security-sentinel agent)

**Actions:**
- Identified unvalidated webhook URL forwarding full PII
- Identified HTTP transport risk and SSRF potential
- Drafted URL validation approach

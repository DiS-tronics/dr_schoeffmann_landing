---
status: done
priority: p1
issue_id: "003"
tags: [code-review, security, rate-limiting, dos, contact-api]
dependencies: []
---

# Add rate limiting to `/api/contact` — DoS amplification via webhook

## Problem Statement

The contact form API endpoint (`/api/contact`) has no rate limiting. Any HTTP client can issue an unlimited number of POST requests. When a `CONTACT_WEBHOOK` is configured, each inbound request triggers an outbound `fetch()` to the webhook URL — meaning spam is amplified into outbound webhook calls, exhausting Vercel function invocations and potentially triggering third-party rate limits.

## Findings

- `pages/api/contact.js` — no IP-throttle, token bucket, or request-count check anywhere in the handler
- The `CONTACT_WEBHOOK` fetch is triggered for every request that passes the basic presence check (`name && email && message`)
- A simple `ab -n 1000 -c 50 /api/contact` benchmark (Apache Bench) would send 1000 webhook calls in seconds
- Vercel Hobby plan: 100,000 function invocations/month free tier — a 10-minute bot run could exhaust the monthly quota
- This is especially problematic for a GDPR-sensitive medical practice where webhook destinations might be email services capturing patient contact data

## Proposed Solutions

### Option 1: Upstash Redis Rate Limit (`@upstash/ratelimit`)

**Approach:** Use Upstash Redis (free tier available) with `@upstash/ratelimit` — the canonical rate limiting solution for Next.js on Vercel.

```js
// pages/api/contact.js
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),  // UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env vars
  limiter: Ratelimit.slidingWindow(5, '10 m'),  // 5 requests per IP per 10 minutes
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket.remoteAddress ?? 'unknown'
  const { success } = await ratelimit.limit(ip)
  if (!success) return res.status(429).json({ error: 'Zu viele Anfragen. Bitte warten Sie einige Minuten.' })

  // ... rest of handler
}
```

**Pros:**
- Production-grade, battle-tested
- Works perfectly on Vercel Edge/Functions
- Free tier: 10,000 requests/day on Upstash
- Sliding window prevents burst and sustained attacks

**Cons:**
- Requires setting up Upstash account + 2 env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
- Adds `@upstash/ratelimit` + `@upstash/redis` dependencies

**Effort:** 30 minutes  
**Risk:** Low

---

### Option 2: In-memory rate limiter (no external dependency)

**Approach:** Simple in-memory Map tracking timestamps per IP. Zero dependencies, but resets on cold start.

```js
const ipMap = new Map()
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000  // 10 minutes

function isRateLimited(ip) {
  const now = Date.now()
  const times = (ipMap.get(ip) || []).filter(t => now - t < WINDOW_MS)
  if (times.length >= LIMIT) return true
  times.push(now)
  ipMap.set(ip, times)
  return false
}
```

**Pros:**
- Zero dependencies
- Zero infrastructure setup

**Cons:**
- Resets on every Vercel cold start (ineffective against persistent bots)
- Memory leaks if ipMap grows unbounded (no cleanup)
- Not distributed — multiple Vercel function instances each have their own map

**Effort:** 15 minutes  
**Risk:** Medium (limited effectiveness)

---

### Option 3: Vercel Firewall / WAF (no code change)

**Approach:** Configure Vercel's IP blocking or rate limiting rules in the project settings.

**Pros:**
- No code change required
- Works at the edge before function invocation

**Cons:**
- Requires Vercel Pro plan for custom rules
- Coarse-grained compared to per-IP sliding window

**Effort:** 10 minutes (Vercel dashboard)  
**Risk:** Low

## Recommended Action

Implement **Option 1** (Upstash) for production-grade protection. If Upstash setup is not feasible, use **Option 2** as a short-term stopgap until proper rate limiting can be added.

## Technical Details

**Affected files:**
- `pages/api/contact.js`

**New env vars required (Option 1):**
- `UPSTASH_REDIS_REST_URL` — from Upstash dashboard
- `UPSTASH_REDIS_REST_TOKEN` — from Upstash dashboard

**New dependencies (Option 1):**
- `@upstash/ratelimit`
- `@upstash/redis`

**Related todos:**
- `004-pending-p2-contact-api-pii-logging-input-validation.md` — additional hardening of the same endpoint

## Acceptance Criteria

- [ ] POST requests to `/api/contact` are rate-limited per IP (max 5 per 10 minutes recommended)
- [ ] Requests exceeding the limit receive `429` with a user-friendly German error message
- [ ] Webhook is not called for rate-limited requests
- [ ] Rate limiting mechanism survives Vercel function cold starts (if using Upstash)
- [ ] `npm run build` passes

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (security-sentinel agent)

**Actions:**
- Identified no rate limiting on /api/contact
- Identified webhook amplification vector
- Researched Upstash as standard Vercel solution
- Documented three implementation options

## Notes

- Vercel Hobby/Pro deployments: `x-forwarded-for` header is reliable for IP extraction
- Austrian medical practice: DSGVO also requires evidence of reasonable technical security measures — rate limiting is a baseline
- See also: `004-pending-p2-contact-api-pii-logging-input-validation.md` for GDPR/DSGVO concerns on the same endpoint

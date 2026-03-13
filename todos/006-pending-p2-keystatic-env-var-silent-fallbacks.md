---
status: done
priority: p2
issue_id: "006"
tags: [code-review, security, keystatic, env-vars, misconfiguration]
dependencies: []
---

# Replace silent env var fallbacks in `keystatic.config.js` with explicit errors

## Problem Statement

Two environment variables (`GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`) have silent fallback values in `keystatic.config.js`. If these are missing in production, Keystatic silently targets the wrong GitHub repository — every CMS save "succeeds" but the content commit goes nowhere (or to a non-existent repo). There is no error, no warning, and the Keystatic UI shows a false-positive success state.

## Findings

- `owner: process.env.GITHUB_REPO_OWNER || 'owner'` — fallback `'owner'` is not a real GitHub username; API calls will return 404 silently
- `name: process.env.GITHUB_REPO_NAME || 'dr_schoeffmann_cms'` — hardcodes the real repository name in source code; less dangerous but still masks misconfiguration
- `storage.kind` ternary: `process.env.NODE_ENV === 'production' ? 'github' : 'local'` — if `NODE_ENV` is not reliably `'production'` in a preview/staging deployment, the full CMS API is exposed with no authentication
- On Vercel, `NODE_ENV` **is** set to `'production'` for all deployments (production + preview), so the ternary works correctly for that hosting target — but this assumption is undocumented

## Proposed Solutions

### Option 1: Throw at startup if required vars are missing in production

**Approach:** Replace OR-fallbacks with explicit error throws for production, keeping local dev behavior safe.

```js
// keystatic.config.js — storage section
const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  if (!process.env.GITHUB_REPO_OWNER) {
    throw new Error('[keystatic.config.js] GITHUB_REPO_OWNER env var is required in production')
  }
  if (!process.env.GITHUB_REPO_NAME) {
    throw new Error('[keystatic.config.js] GITHUB_REPO_NAME env var is required in production')
  }
}

export default config({
  storage: {
    kind: isProduction ? 'github' : 'local',
    repo: {
      owner: process.env.GITHUB_REPO_OWNER,  // undefined in local dev is fine — storage is 'local'
      name: process.env.GITHUB_REPO_NAME,
    },
  },
  // ...
})
```

**Pros:**
- Deployment fails loudly if env vars are missing — caught immediately in Vercel deploy logs
- Removes misleading fallback strings from source code
- Local dev (NODE_ENV=development) unaffected

**Cons:**
- Build/start will throw if run in production without env vars set (intentional, desired behaviour)

**Effort:** 10 minutes  
**Risk:** Low

## Recommended Action

Implement Option 1. A loud failure at startup is far better than silent data loss during CMS editing.

## Technical Details

**Affected files:**
- `keystatic.config.js` — storage configuration block (~lines 37–44)

**README update required:**
The `README.md` already documents these env vars in the Vercel deployment section. No additional documentation needed, but confirm the variable names match exactly.

## Acceptance Criteria

- [ ] Production deployment with missing `GITHUB_REPO_OWNER` throws a clear error (not a silent 404)
- [ ] Production deployment with missing `GITHUB_REPO_NAME` throws a clear error
- [ ] Local dev (`NODE_ENV !== 'production'`) still works without these vars set
- [ ] Fallback string `'owner'` and `'dr_schoeffmann_cms'` removed from source
- [ ] `npm run build` passes when env vars are set

## Work Log

### 2026-03-13 — Initial Discovery

**By:** ce-review (security-sentinel + architecture-strategist agents)

**Actions:**
- Identified `|| 'owner'` fallback as silent misconfiguration risk
- Confirmed Vercel sets NODE_ENV=production for all deployments (preview + production)
- Drafted throw-at-startup approach

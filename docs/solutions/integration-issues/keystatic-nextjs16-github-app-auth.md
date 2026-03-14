---
title: Keystatic auth 401 on Vercel — OAuth App vs GitHub App
category: integration-issues
date: 2026-03-14
tags: [keystatic, nextjs, vercel, github-oauth, github-app, authentication, app-router]
---

# Keystatic auth 401 on Vercel — OAuth App vs GitHub App

## Problem

After deploying Keystatic to Vercel, the `/keystatic` dashboard loads but every
action (and the initial `refresh-token` call) returns HTTP 401:

```
XHRPOST https://example.vercel.app/api/keystatic/github/refresh-token
[HTTP/2 401 174ms]
```

Clearing cookies, re-logging in, and verifying env vars made no difference.

## Root Cause

`@keystatic/core` (v0.5.x) calls GitHub's token endpoint with
`grant_type=refresh_token` during auth. Standard GitHub **OAuth Apps** never
return `refresh_token`, `expires_in`, or `refresh_token_expires_in` — only
**GitHub Apps** (which use short-lived tokens) do.

The internal `tokenDataResultType` schema (in `keystatic-core-api-generic.js`)
requires all four fields:

```js
const tokenDataResultType = s.type({
  access_token: s.string(),
  expires_in: s.number(),          // ← missing from OAuth App responses
  refresh_token: s.string(),       // ← missing from OAuth App responses
  refresh_token_expires_in: s.number(), // ← missing from OAuth App responses
  scope: s.string(),
  token_type: s.literal('bearer')
});
```

When validation fails, `githubRefreshToken` returns `{ status: 401 }` — even
though the OAuth handshake itself succeeded.

## Solution

Replace the GitHub OAuth App with a **GitHub App**.

### Steps

1. **GitHub → Settings → Developer Settings → GitHub Apps → New GitHub App**
2. Fill in:
   - **GitHub App name**: any unique name (e.g. `my-project-keystatic`)
   - **Homepage URL**: your Vercel URL
   - **User authorization callback URL**:
     `https://your-domain.vercel.app/api/keystatic/github/oauth/callback`
   - Uncheck **Webhook → Active**
3. **Repository permissions**:
   - `Contents: Read & write`
   - `Pull requests: Read & write`
   - `Metadata: Read-only` (auto-set)
4. **Where can this app be installed?** → `Only on this account`
5. Click **Create GitHub App**
6. Copy **Client ID** (format: `Iv1.xxxxxxxx`) → `KEYSTATIC_GITHUB_CLIENT_ID`
7. **Generate a new client secret** → `KEYSTATIC_GITHUB_CLIENT_SECRET`
8. In the sidebar → **Install App** → install on your repo

Update Vercel env vars with the new Client ID and secret, then redeploy.

## What Did NOT Work

- Clearing browser cookies and re-authenticating
- Redeploying without env var changes
- Adding `NEXT_PUBLIC_` prefix to `GITHUB_REPO_OWNER`/`GITHUB_REPO_NAME`
- Checking/fixing the OAuth callback URL
- Using `makeAPIRouteHandler` (Pages Router) vs `makeRouteHandler` (App Router)

## Prevention

**Always use a GitHub App, never a GitHub OAuth App**, when setting up Keystatic
for production. The Keystatic docs may mention "OAuth App" instructions that
apply to older versions — current `@keystatic/core` (v0.5+) requires GitHub App
token semantics (short-lived + refresh tokens).

Checklist for new Keystatic setups on Vercel:
- [ ] GitHub App created (not OAuth App)
- [ ] App installed on the target repository
- [ ] `KEYSTATIC_GITHUB_CLIENT_ID` starts with `Iv1.`
- [ ] `KEYSTATIC_SECRET` is at least 32 characters
- [ ] All env vars scoped to **Production** in Vercel

## Related

- [Next.js 16 + Keystatic App Router migration](../build-errors/keystatic-nextjs16-app-router-migration.md)

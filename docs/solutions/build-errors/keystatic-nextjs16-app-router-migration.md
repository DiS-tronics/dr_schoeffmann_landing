---
title: Keystatic infinite loop / script errors on Next.js 16 — App Router migration
category: build-errors
date: 2026-03-14
tags: [keystatic, nextjs, nextjs16, turbopack, app-router, pages-router, migration]
---

# Keystatic infinite loop / script errors on Next.js 16 — App Router migration

## Problem

After upgrading to Next.js 16, the Keystatic dashboard at `/keystatic` shows an
infinite redirect loop and/or script loading failures in local dev. The browser
console shows ERR_TOO_MANY_REDIRECTS or missing chunk errors.

## Root Cause

Next.js 16 uses Turbopack by default. The Keystatic **Pages Router** integration
(`@keystatic/next/ui/pages` + `makeAPIRouteHandler`) is incompatible with
Turbopack. The `--webpack` workaround flag was removed in Next.js 16.

## Solution

Migrate Keystatic routes from Pages Router to **App Router**. The rest of the
site can remain on Pages Router — Next.js supports mixed-mode.

### 1. Create App Router files

**`app/layout.js`** (mandatory root layout — cannot be omitted):
```js
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
```

**`app/keystatic/keystatic.js`**:
```js
'use client'
import { makePage } from '@keystatic/next/ui/app'
import config from '../../keystatic.config'
export default makePage(config)
```

**`app/keystatic/layout.js`**:
```js
import KeystaticApp from './keystatic'
export default function Layout() {
  return <KeystaticApp />
}
```

**`app/keystatic/[[...params]]/page.js`**:
```js
export default function Page() {
  return null
}
```

**`app/api/keystatic/[...params]/route.js`**:
```js
import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../keystatic.config'  // 4 levels up, not 5
export const { GET, POST } = makeRouteHandler({ config })
```

### 2. Delete old Pages Router files

```
pages/keystatic/[[...params]].js
pages/api/keystatic/[...params].js
```

### 3. Fix CI (GitHub Actions)

The `makeRouteHandler` validates env vars at module evaluation time (build
step). Add placeholder vars to avoid CI failure:

```yaml
# .github/workflows/deploy.yml
- run: npm run build
  env:
    KEYSTATIC_GITHUB_CLIENT_ID: placeholder
    KEYSTATIC_GITHUB_CLIENT_SECRET: placeholder
    KEYSTATIC_SECRET: placeholder
```

## Common Mistakes

- **Import path depth**: `app/api/keystatic/[...params]/route.js` is 4 directories
  deep, so `keystatic.config` is 4 levels up (`../../../../`), not 5.
- **Missing root layout**: App Router requires `app/layout.js` with `<html>` and
  `<body>` tags. Without it you get:
  `Runtime Error: Missing <html> and <body> tags in the root layout`
- **Wrong import**: Use `@keystatic/next/ui/app` (not `@keystatic/next/ui/pages`)
  and `makeRouteHandler` from `@keystatic/next/route-handler` (not `makeAPIRouteHandler`).

## Prevention

When starting a new project with Next.js 16+ and Keystatic, always use the App
Router setup from the beginning. The Pages Router setup is legacy and only
documented for older Keystatic versions.

## Related

- [Keystatic auth 401 — OAuth App vs GitHub App](../integration-issues/keystatic-nextjs16-github-app-auth.md)

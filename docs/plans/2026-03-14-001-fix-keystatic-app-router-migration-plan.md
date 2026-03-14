---
title: "fix: Migrate Keystatic routes to App Router for Next.js 16 compatibility"
type: fix
status: active
date: 2026-03-14
---

# fix: Migrate Keystatic routes to App Router for Next.js 16 compatibility

## Problem

The Keystatic admin at `/keystatic` is broken in Next.js 16. Scripts fail to load (`/_next/static/chunks/…` 404s), and the page loops infinitely. Opening browser DevTools temporarily unmasks it — a classic symptom of Next.js 16's new cross-origin dev-server security blocking the Pages Router Keystatic shell.

**Root cause:** The official Keystatic docs (https://keystatic.com/docs/installation-next-js) now only document the **App Router** setup. The current codebase uses the **Pages Router** integration (`makePage` from `@keystatic/next/ui/pages` + `makeAPIRouteHandler` from `@keystatic/next/api`). Next.js 16 broke this Pages Router integration. The App Router integration (`makePage` from `@keystatic/next/ui/app` + `makeRouteHandler` from `@keystatic/next/route-handler`) is the correct approach.

Next.js supports **running both routers simultaneously** — all existing site pages stay in `pages/`, only the two Keystatic-specific routes move to `app/`.

---

## Relevant Files

| File | Action |
|---|---|
| `pages/keystatic/[[...params]].js` | **DELETE** — Pages Router Keystatic UI page |
| `pages/api/keystatic/[...params].js` | **DELETE** — Pages Router API route |
| `app/keystatic/keystatic.js` | **CREATE** — client component using `makePage` from `ui/app` |
| `app/keystatic/layout.js` | **CREATE** — layout that renders the Keystatic client component |
| `app/keystatic/[[...params]]/page.js` | **CREATE** — empty page shell |
| `app/api/keystatic/[...params]/route.js` | **CREATE** — App Router API route using `makeRouteHandler` |
| `package.json` | **REVERT** — remove `--webpack` flag from dev script |

---

## Acceptance Criteria

- [ ] `http://localhost:3000/keystatic` opens and loads without script errors
- [ ] All CMS singletons (Startseite, Über mich, Leistungen, Ordination, Kontakt) are accessible in the dashboard
- [ ] The `pages` collection is accessible in the dashboard
- [ ] Content saves (local mode) write to `content/` YAML/mdoc files correctly
- [ ] All existing site pages (`/`, `/about`, `/services`, `/ordination`, `/contact`, `/[slug]`) continue to work
- [ ] `npm run build` passes with no errors
- [ ] `npm run dev` works without `--webpack` flag (webpack flag removed from package.json)

---

## Implementation Plan

### Step 1 — `package.json`: revert dev script

Remove the `--webpack` flag (no longer needed with App Router):

```json
"dev": "next dev"
```

### Step 2 — `next.config.js`: ensure no leftover allowedDevOrigins

The `allowedDevOrigins` workaround is not needed — remove it if present (keep the file minimal):

```js
const nextConfig = {
  reactStrictMode: true,
  images: { domains: [], formats: ['image/avif', 'image/webp'] },
}
module.exports = nextConfig
```

### Step 3 — Create `app/keystatic/keystatic.js`

```js
// app/keystatic/keystatic.js
"use client";
import { makePage } from '@keystatic/next/ui/app'
import config from '../../keystatic.config'

export default makePage(config)
```

### Step 4 — Create `app/keystatic/layout.js`

```js
// app/keystatic/layout.js
import KeystaticApp from './keystatic'

export default function Layout() {
  return <KeystaticApp />
}
```

### Step 5 — Create `app/keystatic/[[...params]]/page.js`

```js
// app/keystatic/[[...params]]/page.js
export default function Page() {
  return null
}
```

### Step 6 — Create `app/api/keystatic/[...params]/route.js`

```js
// app/api/keystatic/[...params]/route.js
import { makeRouteHandler } from '@keystatic/next/route-handler'
import config from '../../../../../keystatic.config'

export const { GET, POST } = makeRouteHandler({ config })
```

### Step 7 — Delete old Pages Router Keystatic files

- Delete `pages/keystatic/[[...params]].js`
- Delete `pages/api/keystatic/[...params].js`

---

## Risk & Notes

- **Mixed router mode**: Next.js fully supports Pages Router + App Router in the same project. The `app/` directory will only be created for the Keystatic routes — all site pages remain untouched in `pages/`.
- **`keystatic.config.js` unchanged**: The config file itself does not need modification — both router modes use it identically.
- **Production (Vercel)**: No changes needed. `makeRouteHandler` works as a standard Next.js App Router API route on Vercel.
- **`app/` directory requires `appDir` option?**: In Next.js 13–15 the `app/` directory needed `experimental.appDir: true`. In Next.js 16 it is stable and on by default — no config change needed.

---

## Sources & References

- Keystatic Next.js installation docs: https://keystatic.com/docs/installation-next-js
- `@keystatic/next` exports: `./ui/app`, `./route-handler` (confirmed present in v5.0.4)
- `pages/keystatic/[[...params]].js` — current Pages Router UI page
- `pages/api/keystatic/[...params].js` — current Pages Router API route

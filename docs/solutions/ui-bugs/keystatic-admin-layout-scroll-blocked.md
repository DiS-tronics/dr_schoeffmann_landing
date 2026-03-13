---
title: "Keystatic admin UI scroll blocked by global _app.js layout wrapper"
date: 2026-03-12
category: ui-bugs
tags:
  - keystatic
  - next.js
  - getlayout
  - layout
  - scrolling
  - pages-router
  - full-screen-spa
problem_type: layout-constraint
components_affected:
  - pages/keystatic/[[...params]].js
  - pages/_app.js
severity: high
status: resolved
related_issues: []
---

# Keystatic admin UI scroll blocked by global `_app.js` layout wrapper

## Problem

After integrating Keystatic, the admin UI at `/keystatic` rendered visually but could not be scrolled. Content below the fold was permanently inaccessible — the entire CMS was unusable for editing any record longer than the visible viewport.

## Root Cause

`pages/_app.js` wrapped **every** page in a `<DefaultLayout>` that included `<Nav>` and `<Footer>`:

```js
// pages/_app.js — BEFORE fix
export default function App({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}
```

Keystatic's admin (`makePage(config)`) renders a **full-screen SPA** that expects to own the entire document height and control its own overflow/scroll behaviour. Wrapping it in a fixed-height `<main>` + `<Nav>` + `<Footer>` shell constrained its layout container, clipping content and blocking scroll.

## Solution

Use the standard Next.js Pages Router **per-page layout** pattern. Pages that need to opt out of the global wrapper define a static `getLayout` property; `_app.js` reads it and falls back to the default layout for all other pages.

### Step 1 — Opt the Keystatic page out of the default layout

```js
// pages/keystatic/[[...params]].js
import { makePage } from '@keystatic/next/ui/app'
import config from '../../keystatic.config'

const KeystaticPage = makePage(config)

// Full-screen admin SPA — must not inherit Nav+Footer layout
KeystaticPage.getLayout = (page) => page

export default KeystaticPage
```

### Step 2 — Support per-page `getLayout` in `_app.js`

```js
// pages/_app.js
import Nav from '../components/Nav'
import Footer from '../components/Footer'

function DefaultLayout({ children }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App({ Component, pageProps }) {
  // Pages can opt out of the default layout by defining getLayout.
  // e.g. KeystaticPage.getLayout = (page) => page
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)
  return getLayout(<Component {...pageProps} />)
}
```

With this pattern, all existing pages continue to receive `<Nav>` and `<Footer>` automatically. Only the Keystatic page (and any future page that explicitly sets `getLayout`) opts out.

## Prevention

### Rule: Full-screen SPA pages must always opt out of the global layout

Any page that renders a full-screen third-party application (CMS admin, analytics dashboard, map viewer, embedded video editor, etc.) **must** carry the `getLayout` opt-out:

```js
MyFullScreenPage.getLayout = (page) => page
```

### Future-proof `_app.js` from day one

When setting up a new Next.js Pages Router project, always implement the `getLayout` pattern upfront in `_app.js` — even before you need it. The cost is two lines; the benefit is that any future page can opt out without touching `_app.js`.

```js
const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)
return getLayout(<Component {...pageProps} />)
```

### Code review trigger

If a PR adds a new route under `pages/` that imports a third-party full-screen component, immediately ask:

> "Does this page need `getLayout = (page) => page` to opt out of the Nav+Footer wrapper?"

### Test after adding new full-screen pages

1. Load the page in a browser
2. Add enough content / navigate to a section that requires vertical scrolling
3. Confirm the page actually scrolls
4. Confirm `<Nav>` and `<Footer>` do **not** appear on the page

## Related

- **Next.js docs:** [Per-page layouts (Pages Router)](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#per-page-layouts)
- **Origin plan (Keystatic integration):** `docs/plans/2026-03-12-001-feat-keystatic-cms-aceternity-ui-plan.md`
- **Fix location (opt-out):** `pages/keystatic/[[...params]].js` — `KeystaticPage.getLayout = (page) => page`
- **Fix location (support):** `pages/_app.js` — `Component.getLayout` check
- **See also:** [`docs/solutions/runtime-errors/keystatic-blocks-schema-assertnever-crash.md`](../runtime-errors/keystatic-blocks-schema-assertnever-crash.md) — companion fix from the same session

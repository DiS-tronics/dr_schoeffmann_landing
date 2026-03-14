---
title: "fix: Add missing root layout for App Router"
type: fix
status: active
date: 2026-03-14
---

# fix: Add missing root layout for App Router

Next.js App Router requires a root `app/layout.js` file that wraps all App Router pages in `<html>` and `<body>` tags. Our migration added Keystatic routes under `app/` but never created the mandatory root layout, causing:

```
Runtime Error
Missing <html> and <body> tags in the root layout.
```

## Acceptance Criteria

- [ ] `app/layout.js` exists with `<html>` and `<body>` tags
- [ ] `/keystatic` loads without the runtime error in both dev and production
- [ ] All existing Pages Router pages remain unaffected
- [ ] Build passes (`npm run build` exits 0)

## Context

In a mixed Pages Router + App Router project, Next.js still requires `app/layout.js` to exist as the root layout for any App Router segment. The Keystatic `app/keystatic/layout.js` is a **nested** layout — it cannot substitute for the root.

The root layout must only provide the structural HTML shell; it must **not** import global CSS or register fonts (those are already handled by `pages/_app.js` for the Pages Router). Using `suppressHydrationWarning` on `<body>` is a common pattern to avoid hydration mismatches from browser extensions.

## Implementation

### `app/layout.js` (new file)

```js
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
```

No imports, no styles — the Keystatic SPA manages its own styles. `lang="de"` matches the site language.

## Sources

- Next.js docs: https://nextjs.org/docs/messages/missing-root-layout-tags
- Related plan: [docs/plans/2026-03-14-001-fix-keystatic-app-router-migration-plan.md](2026-03-14-001-fix-keystatic-app-router-migration-plan.md)

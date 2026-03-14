# Ordination Dr. Thomas Schöffmann

Website für die Ordination Dr. Thomas Schöffmann – Facharzt für Orthopädie und Traumatologie in Liebenfels, Kärnten.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Pages Router for site pages, App Router for Keystatic) |
| CMS | [Keystatic](https://keystatic.com) – git-backed, admin UI at `/keystatic` |
| Animations | [Framer Motion](https://www.framer.com/motion/) + Aceternity UI components |
| Styling | Tailwind CSS 3 |
| Deployment | Vercel |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000
# → CMS admin: http://localhost:3000/keystatic
```

In development, Keystatic runs in **local mode** — all content edits are written directly to the YAML/mdoc files in `content/`.

## Project Structure

```
content/          # CMS-managed content (YAML + mdoc)
  home.yaml       # Home page (hero, benefits, CTA)
  about.mdoc      # About page (bio, career, education) – rich text body
  services.yaml   # Services & operative procedures
  ordination.yaml # Ordination gallery
  contact.yaml    # Contact information + Impressum fields
  pages/          # Dynamic pages created via CMS
app/              # App Router (Keystatic UI + API only)
  keystatic/      # Keystatic admin dashboard
  api/keystatic/  # Keystatic API route handler
components/
  ui/             # Aceternity UI components (WobbleCard, Spotlight, MovingBorder)
pages/            # Next.js pages (all use getStaticProps + Keystatic reader)
  [slug].js       # Dynamic route for CMS-managed pages collection
public/images/    # All static images (uploaded via CMS or manually)
```

## Content Editing

Open `/keystatic` in the browser (local or production) to edit content.

### Available CMS sections

| Page | What you can edit |
|---|---|
| **Startseite** | Hero title/subtitle, benefit cards (image upload, title, description), CTA |
| **Über mich** | Rich-text biography (bold, italic, lists, headings), education, career, memberships, and flexible extra sections |
| **Leistungen** | Intro text, service list, operative procedures (image upload), and flexible extra sections |
| **Ordination** | Gallery images (image upload with drag-and-drop), page text |
| **Kontakt** | Address, phone, email, opening hours, arrival info, Impressum fields |
| **Seiten** | Dynamic pages — create new pages with a URL slug and rich-text body |

### Adding flexible content (extra sections)

On the **Über mich** and **Leistungen** pages you can append additional sections below the fixed content. Click **+ Add section** in the Keystatic admin and choose one of:

- **Textabschnitt** — optional heading + paragraph text
- **Bild mit Beschriftung** — photo upload + caption
- **Hinweisbox** — highlighted callout text

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git push origin main
```

Vercel auto-deploys on every push to `main`.

### 2. Set Environment Variables in Vercel

Go to **Vercel → Project → Settings → Environment Variables** and add:

| Variable | Required | Description |
|---|---|---|
| `GITHUB_REPO_OWNER` | Yes | Your GitHub username or org (e.g. `DiS-tronics`) |
| `GITHUB_REPO_NAME` | Yes | The repository name (e.g. `dr_schoeffmann_landing`) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Yes | From the GitHub OAuth App (see below) |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Yes | From the GitHub OAuth App |
| `KEYSTATIC_SECRET` | Yes | Any random 32-character string |

Set all five variables for the **Production** environment (and optionally Preview).

### 3. Create a GitHub App

Keystatic requires a **GitHub App** (not an OAuth App) because it uses short-lived tokens with refresh support. An OAuth App returns no `refresh_token`, causing persistent 401 errors on the `/api/keystatic/github/refresh-token` endpoint.

1. Go to **GitHub → Settings → Developer settings → GitHub Apps → New GitHub App**
2. Fill in:
   - **GitHub App name**: `dr-schoeffmann-keystatic` (or any unique name)
   - **Homepage URL**: `https://your-domain.vercel.app`
   - **User authorization callback URL**: `https://your-domain.vercel.app/api/keystatic/github/oauth/callback`
   - Uncheck **Active** under Webhook
3. Set **Repository permissions**: `Contents: Read & write`, `Pull requests: Read & write`
4. Under **Where can this GitHub App be installed?** → select **Only on this account**
5. Click **Create GitHub App**
6. Copy the **Client ID** (format: `Iv1.xxxxxxxx`) → paste as `KEYSTATIC_GITHUB_CLIENT_ID`
7. Click **Generate a new client secret** → paste as `KEYSTATIC_GITHUB_CLIENT_SECRET`
8. In the sidebar, click **Install App** and install it on the `dr_schoeffmann_landing` repository

> ⚠️ Using a GitHub OAuth App instead of a GitHub App will result in persistent 401 errors on the live site, because OAuth Apps do not issue refresh tokens.

### 4. Generate `KEYSTATIC_SECRET`

Run this in your terminal to generate a secure random value:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the output as `KEYSTATIC_SECRET`.

### 5. Redeploy

After adding environment variables, trigger a new deployment:

```
Vercel → Deployments → Redeploy
```

Keystatic will now run in **GitHub mode** in production — content changes made in `/keystatic` are committed directly to your GitHub repository and trigger a new Vercel deployment automatically.

---

## How Keystatic Works in Production

```
Editor → /keystatic (Vercel) → GitHub OAuth → commits YAML/mdoc to repo → Vercel redeploy → updated site
```

- The admin UI is protected by GitHub OAuth — only GitHub accounts with write access to the repo can edit content.
- Every save creates a new commit on `main` (or a branch, configurable).
- Vercel's GitHub integration picks up the commit and rebuilds the static site.

---

## Adding New Images

### Via CMS (recommended)

In the Keystatic admin, image fields show an **Upload** button. Images are automatically saved to `public/images/` and committed to the repository.

### Manually

Copy the image to `public/images/` and commit it. Then reference it in the CMS:
- For text fields still using paths: use just the filename (e.g. `thomas.png`), not `/images/thomas.png`

---

## Build & Production

```bash
npm run build   # Static build (8 routes, all SSG)
npm run start   # Serve production build locally
```

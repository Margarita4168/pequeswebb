# Peques Anglo-Spanish Nursery Schools — Landing Page

Trilingual nursery landing page for **Peques Anglo-Spanish Nursery Schools** (peques.co.uk).  
Fulham, London · English · Español · 中文 · Established 1999.

---

## Project structure

```
/
├── index.html      ← Complete landing page (HTML + CSS + JS, self-contained)
├── vercel.json     ← Vercel deployment config
└── README.md       ← This file
```

The page is **fully self-contained** — all CSS, JavaScript, and the logo image  
are embedded directly in `index.html`. No external dependencies, no build step.

---

## Deploy to Vercel

### Option A — Vercel Dashboard (recommended)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Framework preset: **Other** (static)
5. Leave all build settings blank
6. Click **Deploy**

Your site will be live at `https://your-project.vercel.app` within ~30 seconds.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Connect a custom domain

1. In Vercel dashboard → your project → **Settings → Domains**
2. Add `peques.co.uk` (or a subdomain such as `www.peques.co.uk`)
3. Follow the DNS instructions shown — typically:
   - **A record** → `76.76.21.21`
   - **CNAME** → `cname.vercel-dns.com`
4. DNS propagation: usually within 1–24 hours

---

## Update content

All content is inside `index.html`. Search for the relevant section comment:

| Section | Comment in HTML |
|---|---|
| Hero copy | `<!-- ═══ HERO ═══ -->` |
| About | `<!-- ═══ ABOUT ═══ -->` |
| Pillars | `<!-- ═══ PILLARS ═══ -->` |
| Settings | `<!-- ═══ SETTINGS ═══ -->` |
| Activities | `<!-- ═══ ACTIVITIES ═══ -->` |
| Testimonials | `<!-- ═══ TESTIMONIALS ═══ -->` |
| Accreditations | `<!-- ═══ ACCREDITATIONS ═══ -->` |
| CTA / Admissions | `<!-- ═══ CTA BANNER ═══ -->` |
| Footer | `<!-- ═══ FOOTER ═══ -->` |

### Replace photo placeholders

Search for `photo-frame` in the HTML and replace the placeholder `<div>` with:

```html
<img src="your-photo.jpg" alt="Description" style="width:100%;height:100%;object-fit:cover;" />
```

### Update email address

Replace all instances of `info@peques.co.uk` with the correct address.

### Update phone numbers

- Fulham Broadway: `0207 385 0055`
- Parsons Green: `0207 385 5333`

---

## Brand colours

| Name | Hex |
|---|---|
| Taupe | `#CFC7B7` |
| Sage dark | `#9FB87A` |
| Warm peach | `#F7D7B5` |
| Ink | `#2E2A22` |
| Warm white | `#FFFDF9` |

---

© 2025 Peques Leisure Ltd. All rights reserved.

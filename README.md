# Peques Anglo-Spanish Nursery Schools — Landing Page

Trilingual nursery landing page for **Peques Anglo-Spanish Nursery Schools** (peques.co.uk).  
Fulham, London · English · Español · 中文 · Established 1999.

---

## Project structure

```
/
├── index.html        ← Landing page (HTML + CSS + JS, self-contained)
├── vercel.json       ← Vercel deployment config
├── README.md         ← This file
└── api/
    └── chat.js       ← Serverless function — OpenAI chat proxy
```

---

## Deploy to Vercel

### 1 — Push to GitHub

Upload all files maintaining the folder structure above (the `api/` folder is essential).

### 2 — Import in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework preset: **Other**
4. Leave all build settings blank
5. Click **Deploy**

### 3 — Add your OpenAI API key (required for chat)

1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** `sk-...` ← your OpenAI secret key
   - Environment: ✅ Production ✅ Preview ✅ Development
3. Click **Save**
4. Go to **Deployments** → click **Redeploy** on the latest deployment

> ⚠️ Never put the API key in `index.html` or commit it to GitHub.  
> It lives only in Vercel's environment variables — the `api/chat.js` function reads it server-side.

---

## Get an OpenAI API key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in / create an account
3. **API Keys** → **Create new secret key**
4. Copy the key immediately — it is shown only once
5. Add it to Vercel as described above

> The widget uses **gpt-4o-mini** — very affordable (~$0.00015 per message).  
> A typical visitor conversation costs less than £0.001.

---

## Connect a custom domain

1. Vercel dashboard → your project → **Settings → Domains**
2. Add `peques.co.uk` (or `www.peques.co.uk`)
3. Follow the DNS instructions:
   - **A record** → `76.76.21.21`
   - **CNAME** → `cname.vercel-dns.com`

---

## Update content

All content is inside `index.html`. Find sections by their HTML comment:

| Section | Comment |
|---|---|
| Hero | `<!-- ═══ HERO ═══ -->` |
| About | `<!-- ═══ ABOUT ═══ -->` |
| Education pillars | `<!-- ═══ PILLARS ═══ -->` |
| Our settings | `<!-- ═══ SETTINGS ═══ -->` |
| Activities | `<!-- ═══ ACTIVITIES ═══ -->` |
| Testimonials | `<!-- ═══ TESTIMONIALS ═══ -->` |
| Accreditations | `<!-- ═══ ACCREDITATIONS ═══ -->` |
| CTA / Admissions | `<!-- ═══ CTA BANNER ═══ -->` |
| Footer | `<!-- ═══ FOOTER ═══ -->` |
| Chat widget | `<!-- ═══ PEQUES AI CHAT WIDGET ═══ -->` |

### Replace photo placeholders

Search for `photo-frame` in the HTML and replace with:
```html
<img src="your-photo.jpg" alt="Description" style="width:100%;height:100%;object-fit:cover;" />
```

### Update email / phone

- Email: replace `info@peques.co.uk` with the correct address
- PFB phone: `0207 385 0055`
- PPG phone: `0207 385 5333`

### Update the AI assistant's knowledge

Edit the `SYSTEM_PROMPT` constant at the top of `api/chat.js` to update any information the assistant knows about Peques.

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

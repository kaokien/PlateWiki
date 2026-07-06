# BoxingWiki — Deployment Sprint Walkthrough

## ✅ What's Been Automated (Done)

| Item | What Was Done |
|------|---------------|
| **Vercel Config** | `vercel.json` — SPA rewrites, immutable asset caching, security headers |
| **GA4 Analytics** | `gtag.js` in `index.html` + `src/utils/analytics.js` module with event tracking |
| **Event Tracking** | Muscle clicks, technique views, search queries (debounced), category filters |
| **Build Pipeline** | `npm run build` now auto-generates sitemap before Vite build |
| **AdSense Script** | Async script tag in `index.html` (placeholder publisher ID) |
| **Search Console** | Verification meta tag in `index.html` (placeholder code) |
| **Sitemap** | 53 URLs auto-generated, `robots.txt` points to it |

---

## 🔧 Your Manual Steps

### Step 1: Deploy to Vercel (5 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy from the project directory
cd "c:\Documents-Fuck Microsoft\BoxingWiki"
vercel --prod
```

> [!TIP]
> When prompted, select:
> - **Set up and deploy?** → Yes
> - **Which scope?** → Your personal account
> - **Link to existing project?** → No
> - **Project name?** → `boxingwiki`
> - **Directory?** → `./`
> - **Override settings?** → No (vercel.json handles everything)

### Step 2: Add Custom Domain (5 min)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your **boxingwiki** project
3. Go to **Settings → Domains**
4. Add: `boxing.coachjoshofficial.com`
5. Vercel will show you a **CNAME record** to add:

```
Type:  CNAME
Name:  boxing
Value: cname.vercel-dns.com
```

6. Go to your DNS provider (wherever `coachjoshofficial.com` is registered)
7. Add the CNAME record above
8. Wait 5-15 minutes for DNS propagation
9. Vercel auto-provisions HTTPS (SSL certificate)

> [!IMPORTANT]
> If you're using **Cloudflare**, set the proxy status to **DNS Only** (gray cloud) initially, then switch to proxied after it verifies.

### Step 3: Google Analytics 4 (3 min)

1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a new **GA4 property** for `boxing.coachjoshofficial.com`
3. Copy the **Measurement ID** (looks like `G-ABC123XYZ`)
4. In `index.html`, find and replace all instances:

```
Find:    G-XXXXXXXXXX
Replace: G-YOUR_ACTUAL_ID
```

> [!NOTE]
> There are **2 occurrences** of `G-XXXXXXXXXX` in `index.html` (the script src and the config call).
> Also update `src/utils/analytics.js` line 19: `export const GA_MEASUREMENT_ID = 'G-YOUR_ACTUAL_ID';`

### Step 4: Google Search Console (5 min)

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Add Property** → **URL prefix** → enter `https://boxing.coachjoshofficial.com`
3. Choose **HTML tag** verification method
4. Copy the `content` value from the meta tag they give you
5. In `index.html`, find and replace:

```
Find:    YOUR_VERIFICATION_CODE
Replace: the_actual_code_from_google
```

6. Commit, push, and redeploy: `vercel --prod`
7. Click **Verify** in Search Console
8. Go to **Sitemaps** → Submit: `https://boxing.coachjoshofficial.com/sitemap.xml`

### Step 5: Google AdSense (10 min)

1. Go to [adsense.google.com](https://adsense.google.com)
2. Sign up / add new site: `boxing.coachjoshofficial.com`
3. Once approved, copy your **Publisher ID** (looks like `ca-pub-1234567890123456`)
4. In `index.html`, find and replace:

```
Find:    ca-pub-XXXXXXXXXXXXXXXX
Replace: ca-pub-YOUR_ACTUAL_ID
```

5. Commit, push, and redeploy

> [!WARNING]
> AdSense approval can take **1-14 days**. The site will work fine without it in the meantime. The placeholder script won't break anything.

---

## Find-and-Replace Cheat Sheet

After getting all your IDs, do these 3 replacements across the codebase:

| Placeholder | File(s) | Replace With |
|-------------|---------|--------------|
| `G-XXXXXXXXXX` | `index.html` (×2), `src/utils/analytics.js` (×1) | Your GA4 Measurement ID |
| `YOUR_VERIFICATION_CODE` | `index.html` (×1) | Google Search Console verification code |
| `ca-pub-XXXXXXXXXXXXXXXX` | `index.html` (×1) | AdSense Publisher ID |

Then:
```bash
git add -A
git commit -m "chore: add production Google IDs"
git push origin main
vercel --prod
```

---

## Events You'll See in GA4

Once live, these custom events will appear in your GA4 dashboard under **Reports → Engagement → Events**:

| Event | Trigger | Parameters |
|-------|---------|------------|
| `muscle_click` | User clicks a body map muscle | `muscle_name`, `muscle_id` |
| `technique_view` | User views a technique page | `technique_name`, `category`, `difficulty` |
| `search` | User searches (debounced 800ms) | `search_term`, `result_count` |
| `filter_category` | User filters by category | `category` |

# SunTimesToday.com Deployment Checklist

## Pre-Deployment Checklist

### 1. Git Status
- [ ] Check git status: `git status`
- [ ] Ensure all changes are committed
- [ ] Push to GitHub: `git push origin main` (or your branch name)

### 2. Environment Variables
**No environment variables required** - This project uses local data files only.

### 3. Build Configuration
- [x] `next.config.ts` is production-safe (no dev-only configs)
- [x] `package.json` build script includes sitemap generation
- [x] No dev-only scripts run in production

### 4. Code Verification
- [ ] Run local build: `npm run build`
- [ ] Verify build completes without errors
- [ ] Check that sitemap generates: `npm run generate-sitemap`

---

## Vercel Deployment Steps

### Step 1: Import Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository (`suntimestoday-v2`)

### Step 2: Configure Project
1. **Project Name**: `suntimestoday-v2` (or your preferred name)
2. **Framework Preset**: Next.js (should auto-detect)
3. **Root Directory**: `./` (leave as default)
4. **Build Command**: `npm run build` (should auto-populate)
5. **Output Directory**: `.next` (should auto-populate)
6. **Install Command**: `npm install` (should auto-populate)

### Step 3: Environment Variables
- **None required** - Click "Deploy" without adding any

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Note your deployment URL (e.g., `suntimestoday-v2.vercel.app`)

### Step 5: Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add `suntimestoday.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 24 hours)

---

## Post-Deployment Verification

### A) Homepage Check
- [ ] Visit: `https://suntimestoday.com/` (or your Vercel URL)
- [ ] Verify page loads without errors
- [ ] Check that sun times table displays correctly
- [ ] Verify city links are present and clickable

### B) City Pages Check
Test these city pages:
- [ ] `https://suntimestoday.com/sunrise-sunset/new-york-ny`
- [ ] `https://suntimestoday.com/sunrise-sunset/los-angeles-ca`
- [ ] `https://suntimestoday.com/sunrise-sunset/chicago-il`
- [ ] `https://suntimestoday.com/sunrise-sunset/seattle-wa`
- [ ] `https://suntimestoday.com/sunrise-sunset/miami-fl`

For each city page, verify:
- [ ] Page loads without 404 errors
- [ ] Sun times table displays correctly
- [ ] "Daylight remaining" message shows
- [ ] SEO paragraphs are visible
- [ ] Related city links work

### C) Canonical URLs
- [ ] Open browser DevTools → View Page Source
- [ ] Check homepage: `<link rel="canonical" href="https://suntimestoday.com/" />`
- [ ] Check city page: `<link rel="canonical" href="https://suntimestoday.com/sunrise-sunset/[slug]" />`
- [ ] Verify all canonical URLs use `suntimestoday.com` (not Vercel URL)

### D) Metadata Verification
For each city page, verify in View Source:
- [ ] `<title>` tag: "Sunrise and Sunset Times in [City], [State] | SunTimesToday"
- [ ] `<meta name="description">` is 150-160 characters
- [ ] OpenGraph tags present (`og:title`, `og:description`, `og:url`)
- [ ] Twitter Card tags present
- [ ] JSON-LD FAQ schema is present in page source

### E) Sitemap Verification
- [ ] Visit: `https://suntimestoday.com/sitemap.xml`
- [ ] Verify XML loads correctly
- [ ] Check that it contains ~335 URLs (1 homepage + 334 city pages)
- [ ] Verify all URLs use `suntimestoday.com` domain
- [ ] Check XML is well-formed (no parsing errors)

### F) Robots.txt Verification
- [ ] Visit: `https://suntimestoday.com/robots.txt`
- [ ] Verify content shows:
  ```
  User-agent: *
  Allow: /
  
  Sitemap: https://suntimestoday.com/sitemap.xml
  ```

### G) Broken Links Check
- [ ] Click through 10-15 city links from homepage
- [ ] Click through 5-10 "Related Cities" links on city pages
- [ ] Verify no 404 errors
- [ ] Verify all internal links work correctly

### H) Performance Check
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on homepage
- [ ] Run PageSpeed Insights on a city page
- [ ] Verify Core Web Vitals are acceptable
- [ ] Check that pages load quickly (< 3 seconds)

---

## SEO Launch Steps

### 1. Google Search Console Setup
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Enter: `https://suntimestoday.com`
4. Verify ownership using one of these methods:
   - **HTML file upload** (download file, upload to `/public/` via Vercel)
   - **HTML tag** (add to `app/layout.tsx` in `<head>`)
   - **DNS verification** (if you manage DNS)

### 2. Submit Sitemap
1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **"Submit"**
4. Wait for Google to process (may take a few hours)
5. Verify status shows "Success" (not "Couldn't fetch")

### 3. Request Indexing for Key Pages
Request indexing for these important pages:
1. Homepage: `https://suntimestoday.com/`
2. Top 10 city pages (New York, Los Angeles, Chicago, etc.)
3. Use the **URL Inspection** tool in Search Console
4. For each URL:
   - Paste URL → Click "Test Live URL"
   - If valid, click **"Request Indexing"**
   - Wait for confirmation

### 4. Monitor Indexing (Next 2-3 Weeks)

#### Week 1: Daily Checks
- [ ] Check Google Search Console **Coverage** report daily
- [ ] Monitor **Indexed** pages count (should increase)
- [ ] Check for any **Errors** or **Warnings**
- [ ] Review **Sitemaps** report for processing status

#### Week 2-3: Every 2-3 Days
- [ ] Check indexing progress in Search Console
- [ ] Monitor **Performance** report for impressions/clicks
- [ ] Review **Queries** to see what searches trigger your pages
- [ ] Check for any crawl errors

### 5. Additional SEO Monitoring

#### Tools to Use:
- **Google Search Console**: Primary tool for indexing and performance
- **Google Analytics** (if added): Track user behavior
- **Ahrefs/SEMrush** (optional): Monitor keyword rankings

#### Key Metrics to Track:
- **Indexed Pages**: Should reach ~335 pages within 2-3 weeks
- **Impressions**: Should start appearing after 1-2 weeks
- **Clicks**: May take 2-4 weeks to see meaningful traffic
- **Average Position**: Track for target keywords like "sunrise sunset [city]"

#### Expected Timeline:
- **Days 1-3**: Google discovers sitemap, starts crawling
- **Days 4-7**: First pages get indexed
- **Days 8-14**: Most pages indexed, impressions start
- **Days 15-21**: Clicks begin, rankings stabilize

---

## Troubleshooting

### If Sitemap Shows Errors:
- Verify sitemap.xml is accessible at `/sitemap.xml`
- Check XML is well-formed (use XML validator)
- Ensure all URLs use HTTPS and correct domain

### If Pages Not Indexing:
- Check robots.txt allows crawling
- Verify pages return 200 status codes
- Ensure canonical URLs are correct
- Check for noindex tags (should not be present)

### If Build Fails:
- Check Vercel build logs for errors
- Verify `npm run build` works locally
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility

---

## Quick Reference

**Production URL**: `https://suntimestoday.com`  
**Sitemap URL**: `https://suntimestoday.com/sitemap.xml`  
**Robots.txt**: `https://suntimestoday.com/robots.txt`  
**Total Pages**: ~335 (1 homepage + 334 city pages)

**Build Command**: `npm run build`  
**Sitemap Generation**: `npm run generate-sitemap`

---

## Notes

- Sitemap auto-generates during build process
- All pages are statically generated at build time
- No external APIs or environment variables required
- City data is stored in `data/cities.json`


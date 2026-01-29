# SEO Setup Guide for refugioslibresdignos.com

## Critical Issues Fixed

I've fixed several critical SEO issues that were preventing your site from ranking properly:

### 1. Wrong Domain Configuration
- **Problem**: The site was configured to use `refusdignos.vercel.app` instead of `refugioslibresdignos.com`
- **Fixed**: Updated `astro.config.mjs` to use the correct domain
- **Impact**: All canonical URLs, sitemaps, and Open Graph tags now use the correct domain

### 2. Missing robots.txt
- **Problem**: No robots.txt file to guide search engines
- **Fixed**: Created `public/robots.txt` that allows all search engines to crawl the site
- **Impact**: Search engines can now properly index all pages

### 3. Vercel.app Domain Showing in Search
- **Problem**: The vercel.app domain was competing with your custom domain
- **Fixed**: Added permanent redirects (301) from all vercel.app URLs to refugioslibresdignos.com
- **Impact**: Google will consolidate all indexing signals to your custom domain

### 4. Missing Structured Data
- **Problem**: No Schema.org markup for rich search results
- **Fixed**: Added Organization schema to all pages
- **Impact**: Better search visibility and potential for rich snippets

## Next Steps: Deploy and Verify

### Step 1: Deploy to Vercel

Commit and push these changes to deploy:

```bash
git add .
git commit -m "fix: critical SEO improvements - correct domain, robots.txt, redirects, structured data"
git push
```

Vercel will automatically deploy your changes. Wait for the deployment to complete.

### Step 2: Verify Domain Redirect

After deployment, test that the redirect works:

```bash
curl -I https://refusdignos.vercel.app
```

You should see:
```
HTTP/2 308
location: https://refugioslibresdignos.com/
```

### Step 3: Set Up Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Select "URL prefix" and enter: `https://refugioslibresdignos.com`
4. Choose one of these verification methods:

   **Option A: HTML File Upload (Recommended)**
   - Download the verification file from Google
   - Place it in the `public/` folder
   - Rebuild and deploy
   - Click "Verify" in Search Console

   **Option B: HTML Meta Tag**
   - Google will provide a meta tag like: `<meta name="google-site-verification" content="xxxxx" />`
   - Add it to `src/layouts/BaseLayout.astro` in the `<head>` section
   - Rebuild and deploy
   - Click "Verify" in Search Console

### Step 4: Submit Your Sitemap

1. In Google Search Console, go to "Sitemaps" (left sidebar)
2. Enter your sitemap URL: `https://refugioslibresdignos.com/sitemap-index.xml`
3. Click "Submit"

Google will start crawling your site. This can take a few days to a few weeks.

### Step 5: Request Indexing for Key Pages

To speed up indexing:

1. In Google Search Console, go to "URL Inspection"
2. Enter each important URL:
   - `https://refugioslibresdignos.com/`
   - `https://refugioslibresdignos.com/proyecto`
   - `https://refugioslibresdignos.com/refugios`
3. Click "Request Indexing" for each

### Step 6: Remove Old Vercel Domain from Search

If the old vercel.app domain is already indexed:

1. In Google Search Console, add the vercel.app domain as a separate property
2. Go to "Removals" in the left sidebar
3. Request removal of outdated content

The 301 redirects will also signal to Google to consolidate the domains.

## Monitor SEO Performance

### Check Indexing Status

In Google Search Console:
- **Coverage**: See which pages are indexed
- **Sitemaps**: Check sitemap processing status
- **Performance**: See search queries and clicks

### Verify Structured Data

Use Google's [Rich Results Test](https://search.google.com/test/rich-results):
- Enter your URL: `https://refugioslibresdignos.com`
- Verify that the Organization schema is detected

### Check Rankings

Use these free tools:
- **Google Search**: Search for "refugios libres dignos" and related terms
- **Google Business Profile**: If you have one, ensure it's linked
- **Analytics**: Monitor organic traffic in Google Analytics

## Improving Rankings Further

### Content Optimization

1. **Add More Content**: Create blog posts about:
   - Mountain refuges in Spain
   - Hiking guides
   - Volunteer stories
   - Before/after rehabilitation stories

2. **Improve Existing Pages**:
   - Add more descriptive text to refuge pages
   - Include location maps
   - Add accessibility information
   - Include user testimonials

### Technical SEO

1. **Page Speed**: Already optimized with image optimization and caching
2. **Mobile-Friendly**: Already responsive
3. **HTTPS**: Already enabled via Vercel

### Off-Page SEO

1. **Backlinks**: Get links from:
   - Hiking blogs and forums
   - Mountain sports websites
   - Local tourism boards
   - Environmental organizations

2. **Social Signals**:
   - Share content on social media
   - Engage with hiking communities
   - Post regular updates about refuge rehabilitation

3. **Local SEO**:
   - Add location-specific keywords
   - Create Google Business Profile
   - Get listed in local directories

## Expected Timeline

- **Indexing**: 3-7 days for Google to start indexing
- **Initial Rankings**: 2-4 weeks to appear in search results
- **Competitive Rankings**: 3-6 months for top positions (with ongoing content)

## Monitoring Checklist

- [ ] Deploy changes to Vercel
- [ ] Verify domain redirect works
- [ ] Set up Google Search Console
- [ ] Submit sitemap
- [ ] Request indexing for key pages
- [ ] Add verification to remove old vercel.app domain
- [ ] Check indexing status weekly
- [ ] Monitor search performance monthly

## Files Changed

1. `astro.config.mjs` - Updated site URL to correct domain
2. `public/robots.txt` - Created to allow search engine crawling
3. `vercel.json` - Added redirects from vercel.app to custom domain
4. `src/layouts/BaseLayout.astro` - Added structured data (Schema.org)

## Need Help?

If you encounter issues:
1. Check Google Search Console for specific errors
2. Use [PageSpeed Insights](https://pagespeed.web.dev/) to verify performance
3. Use [Schema.org Validator](https://validator.schema.org/) to test structured data

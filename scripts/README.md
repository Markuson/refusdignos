# Lighthouse Audit Scripts

## 📋 Overview

Two scripts are available for running Lighthouse performance audits:

1. **Node.js script** (`lighthouse-audit.js`) - Recommended, generates better reports
2. **Bash script** (`lighthouse-audit.sh`) - Alternative if Node.js fails

Both scripts audit 7 key pages on mobile and desktop, generating comprehensive HTML reports.

---

## 🚀 Quick Start

### Step 1: Install Lighthouse CLI

```bash
npm install -g lighthouse
```

### Step 2: Run the audit

**Using Node.js script (Recommended):**
```bash
node scripts/lighthouse-audit.js https://your-production-url.vercel.app
```

**Using Bash script:**
```bash
./scripts/lighthouse-audit.sh https://your-production-url.vercel.app
```

### Step 3: View results

Reports are saved to `./lighthouse-reports/`

Open the summary report:
```bash
open lighthouse-reports/*_summary.html
```

---

## 📊 What Gets Audited

The script tests these pages:

1. `/` - Homepage
2. `/proyecto` - Project page
3. `/refugios` - Refugios listing
4. `/refugios/la-larri` - Refugio detail (sample)
5. `/colaboradores` - Collaborators
6. `/contacto` - Contact page
7. `/legal/privacidad` - Privacy policy (sample)

Each page is tested on:
- 📱 **Mobile** (375x667, mobile emulation)
- 🖥️ **Desktop** (1350x940, desktop emulation)

---

## 📈 Metrics Collected

### Lighthouse Categories (0-100):
- **Performance** (Target: ≥95 desktop, ≥90 mobile)
- **Accessibility** (Target: 100)
- **Best Practices** (Target: ≥95)
- **SEO** (Target: ≥95)

### Core Web Vitals:
- **FCP** (First Contentful Paint) - Target: <1.5s
- **LCP** (Largest Contentful Paint) - Target: <2.5s
- **TBT** (Total Blocking Time) - Target: <150ms
- **CLS** (Cumulative Layout Shift) - Target: <0.1

---

## 📁 Output Files

After running, you'll get:

```
lighthouse-reports/
├── 2025-12-16_homepage_mobile.report.html
├── 2025-12-16_homepage_mobile.report.json
├── 2025-12-16_homepage_desktop.report.html
├── 2025-12-16_homepage_desktop.report.json
├── ... (14 HTML reports total)
└── 2025-12-16_summary.html  ← START HERE
```

**Start with the summary report** - it shows all scores at a glance.

---

## 🔍 Reading the Results

### Score Interpretation:

| Score | Color | Meaning |
|-------|-------|---------|
| 90-100 | 🟢 Green | Excellent |
| 50-89 | 🟠 Orange | Needs improvement |
| 0-49 | 🔴 Red | Poor |

### What to Look For:

1. **Performance scores** - Should be ≥90 (mobile) and ≥95 (desktop)
2. **Accessibility** - Should be 100 on all pages
3. **Core Web Vitals** - All should be in green range
4. **Opportunities** - Click full reports for optimization suggestions

---

## 🐛 Troubleshooting

### "lighthouse: command not found"
```bash
npm install -g lighthouse
# or
pnpm add -g lighthouse
```

### "Error: Unable to connect"
- Check your production URL is correct and accessible
- Make sure site is deployed and live

### "Chrome not found"
```bash
# Install Chrome or Chromium
# Script will use system Chrome by default
```

### Script hangs or times out
- Check your internet connection
- Site might be slow to load
- Try running again

---

## ⚡ Performance Tips

**If scores are low, common fixes:**

1. **Images** - Compress, use WebP, add lazy loading
2. **JavaScript** - Minimize, defer non-critical scripts
3. **CSS** - Remove unused styles, inline critical CSS
4. **Fonts** - Use font-display: swap, preload fonts
5. **Caching** - Set proper cache headers
6. **Third-party** - Minimize external requests

---

## 📚 Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 🔄 Re-running Audits

Run audits:
- After making performance fixes
- Before major releases
- Monthly for monitoring
- After adding new features

Each run creates timestamped reports so you can track improvements over time.

---

**Last Updated**: 2025-12-16

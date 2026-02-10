#!/usr/bin/env node
/**
 * Lighthouse Audit Script for RefugiosLibresDignos
 * Runs performance audits and generates a comprehensive report
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const PRODUCTION_URL = process.argv[2] || 'https://your-url.vercel.app';
const OUTPUT_DIR = path.join(__dirname, '..', 'lighthouse-reports');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

// Pages to audit
const PAGES = [
  { path: '/', name: 'homepage', title: 'Homepage' },
  { path: '/proyecto', name: 'proyecto', title: 'Proyecto Page' },
  { path: '/refugios', name: 'refugios-listing', title: 'Refugios Listing' },
  { path: '/refugios/la-larri', name: 'refugio-detail', title: 'Refugio Detail (La Larri)' },
  { path: '/colaboradores', name: 'colaboradores', title: 'Colaboradores Page' },
  { path: '/contacto', name: 'contacto', title: 'Contacto Page' },
  { path: '/legal/privacidad', name: 'legal-privacidad', title: 'Privacy Policy' },
];

console.log('\n🚀 Lighthouse Audit - RefugiosLibresDignos\n');
console.log(`Production URL: ${PRODUCTION_URL}`);
console.log(`Timestamp: ${TIMESTAMP}`);
console.log(`Output Directory: ${OUTPUT_DIR}\n`);

// Check if lighthouse is installed
async function checkLighthouse() {
  try {
    await execAsync('lighthouse --version');
    return true;
  } catch (error) {
    console.error('❌ Lighthouse CLI not found');
    console.log('Install with: npm install -g lighthouse');
    process.exit(1);
  }
}

// Create output directory
async function setupOutputDir() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating output directory:', error);
    process.exit(1);
  }
}

// Run lighthouse audit
async function runAudit(page, device) {
  const url = `${PRODUCTION_URL}${page.path}`;
  const outputPath = path.join(OUTPUT_DIR, `${TIMESTAMP}_${page.name}_${device}`);

  console.log(`  → ${device} audit...`);

  const formFactor = device === 'mobile' ? 'mobile' : 'desktop';
  const screenEmulation = device === 'mobile'
    ? '--screenEmulation.mobile=true --screenEmulation.width=375 --screenEmulation.height=667'
    : '--screenEmulation.mobile=false --screenEmulation.width=1350 --screenEmulation.height=940';

  try {
    await execAsync(
      `lighthouse "${url}" \\
        --output=json \\
        --output=html \\
        --output-path="${outputPath}" \\
        --chrome-flags="--headless --no-sandbox" \\
        --emulated-form-factor=${formFactor} \\
        ${screenEmulation} \\
        --quiet`,
      { maxBuffer: 1024 * 1024 * 10 }
    );
    return outputPath;
  } catch (error) {
    console.error(`    ❌ Error auditing ${page.name} (${device}):`, error.message);
    return null;
  }
}

// Parse JSON report
async function parseReport(jsonPath) {
  try {
    const content = await fs.readFile(`${jsonPath}.report.json`, 'utf8');
    const report = JSON.parse(content);

    return {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
      fcp: report.audits['first-contentful-paint'].displayValue,
      lcp: report.audits['largest-contentful-paint'].displayValue,
      tbt: report.audits['total-blocking-time'].displayValue,
      cls: report.audits['cumulative-layout-shift'].displayValue,
      htmlReport: path.basename(`${jsonPath}.report.html`),
    };
  } catch (error) {
    console.error('Error parsing report:', error.message);
    return null;
  }
}

// Generate summary HTML
async function generateSummary(auditResults) {
  const summaryPath = path.join(OUTPUT_DIR, `${TIMESTAMP}_summary.html`);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lighthouse Audit Summary - RefugiosLibresDignos</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 {
            color: #284c3e;
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        .meta {
            color: #666;
            margin-bottom: 30px;
            font-size: 1rem;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            border-left: 4px solid #284c3e;
        }
        .summary-card h3 {
            color: #666;
            font-size: 0.95rem;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-card .big-number {
            font-size: 3rem;
            font-weight: bold;
            color: #284c3e;
        }
        .page-section {
            background: white;
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .page-title {
            font-size: 1.5rem;
            color: #284c3e;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .device-section {
            margin-bottom: 30px;
        }
        .device-section:last-child {
            margin-bottom: 0;
        }
        .device-header {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }
        .metric {
            background: #f9f9f9;
            padding: 18px;
            border-radius: 8px;
            border-left: 4px solid #284c3e;
        }
        .metric-label {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
        }
        .score-excellent { color: #0cce6b; }
        .score-good { color: #ffa400; }
        .score-poor { color: #ff4e42; }
        .web-vitals {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .vital {
            background: #fff;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #eee;
        }
        .vital-label {
            font-size: 0.75rem;
            color: #999;
            margin-bottom: 4px;
        }
        .vital-value {
            font-size: 1rem;
            font-weight: 600;
            color: #284c3e;
        }
        .report-link {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background: #E78A33;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background 0.2s;
        }
        .report-link:hover {
            background: #d97626;
        }
        .targets {
            background: #fff3e0;
            border-left: 4px solid #ffa400;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 30px;
        }
        .targets h3 {
            color: #666;
            margin-bottom: 10px;
            font-size: 1rem;
        }
        .targets ul {
            margin-left: 20px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Lighthouse Audit Summary</h1>
        <div class="meta">
            RefugiosLibresDignos Performance Report<br>
            <strong>Date:</strong> ${new Date().toLocaleString()}<br>
            <strong>URL:</strong> ${PRODUCTION_URL}
        </div>

        <div class="targets">
            <h3>🎯 Performance Targets</h3>
            <ul>
                <li><strong>Performance:</strong> ≥95 (desktop), ≥90 (mobile)</li>
                <li><strong>Accessibility:</strong> 100</li>
                <li><strong>Best Practices:</strong> ≥95</li>
                <li><strong>SEO:</strong> ≥95</li>
            </ul>
        </div>

        <div class="summary-grid">
            ${generateSummaryCards(auditResults)}
        </div>

        <div id="page-reports">
            ${auditResults.map(page => generatePageSection(page)).join('')}
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile(summaryPath, html, 'utf8');
  return summaryPath;
}

function generateSummaryCards(results) {
  const totalPages = results.length;
  const avgMobilePerf = Math.round(
    results.reduce((sum, p) => sum + p.mobile.performance, 0) / totalPages
  );
  const avgDesktopPerf = Math.round(
    results.reduce((sum, p) => sum + p.desktop.performance, 0) / totalPages
  );
  const avgAccessibility = Math.round(
    results.reduce((sum, p) => sum + (p.mobile.accessibility + p.desktop.accessibility) / 2, 0) / totalPages
  );

  return `
    <div class="summary-card">
        <h3>Pages Audited</h3>
        <div class="big-number">${totalPages}</div>
    </div>
    <div class="summary-card">
        <h3>Avg Performance (Mobile)</h3>
        <div class="big-number ${getScoreClass(avgMobilePerf)}">${avgMobilePerf}</div>
    </div>
    <div class="summary-card">
        <h3>Avg Performance (Desktop)</h3>
        <div class="big-number ${getScoreClass(avgDesktopPerf)}">${avgDesktopPerf}</div>
    </div>
    <div class="summary-card">
        <h3>Avg Accessibility</h3>
        <div class="big-number ${getScoreClass(avgAccessibility)}">${avgAccessibility}</div>
    </div>
  `;
}

function generatePageSection(page) {
  return `
    <div class="page-section">
        <div class="page-title">${page.title}</div>

        <div class="device-section">
            <div class="device-header">📱 Mobile</div>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-label">Performance</div>
                    <div class="metric-value ${getScoreClass(page.mobile.performance)}">${page.mobile.performance}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Accessibility</div>
                    <div class="metric-value ${getScoreClass(page.mobile.accessibility)}">${page.mobile.accessibility}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Best Practices</div>
                    <div class="metric-value ${getScoreClass(page.mobile.bestPractices)}">${page.mobile.bestPractices}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">SEO</div>
                    <div class="metric-value ${getScoreClass(page.mobile.seo)}">${page.mobile.seo}</div>
                </div>
            </div>
            <div class="web-vitals">
                <div class="vital">
                    <div class="vital-label">FCP</div>
                    <div class="vital-value">${page.mobile.fcp}</div>
                </div>
                <div class="vital">
                    <div class="vital-label">LCP</div>
                    <div class="vital-value">${page.mobile.lcp}</div>
                </div>
                <div class="vital">
                    <div class="vital-label">TBT</div>
                    <div class="vital-value">${page.mobile.tbt}</div>
                </div>
                <div class="vital">
                    <div class="vital-label">CLS</div>
                    <div class="vital-value">${page.mobile.cls}</div>
                </div>
            </div>
            <a href="${page.mobile.htmlReport}" class="report-link" target="_blank">📄 View Full Mobile Report</a>
        </div>

        <div class="device-section">
            <div class="device-header">🖥️ Desktop</div>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-label">Performance</div>
                    <div class="metric-value ${getScoreClass(page.desktop.performance)}">${page.desktop.performance}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Accessibility</div>
                    <div class="metric-value ${getScoreClass(page.desktop.accessibility)}">${page.desktop.accessibility}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Best Practices</div>
                    <div class="metric-value ${getScoreClass(page.desktop.bestPractices)}">${page.desktop.bestPractices}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">SEO</div>
                    <div class="metric-value ${getScoreClass(page.desktop.seo)}">${page.desktop.seo}</div>
                </div>
            </div>
            <div class="web-vitals">
                <div class="vital">
                    <div class="vital-label">FCP</div>
                    <div class="vital-value">${page.desktop.fcp}</div>
                </div>
                <div class="vital">
                    <div class="vital-label">LCP</div>
                    <div class="vital-value">${page.desktop.lcp}</div>
                </div>
                <div class="vital">
                    <div class="vital-label">TBT</div>
                    <div class="vital-value">${page.desktop.tbt}</div>
                </div>
                <div class="vital">
                    <div class="vital-label">CLS</div>
                    <div class="vital-value">${page.desktop.cls}</div>
                </div>
            </div>
            <a href="${page.desktop.htmlReport}" class="report-link" target="_blank">📄 View Full Desktop Report</a>
        </div>
    </div>
  `;
}

function getScoreClass(score) {
  if (score >= 90) return 'score-excellent';
  if (score >= 50) return 'score-good';
  return 'score-poor';
}

// Main execution
async function main() {
  await checkLighthouse();
  await setupOutputDir();

  const auditResults = [];

  for (const page of PAGES) {
    console.log(`\n📄 Auditing: ${page.title}`);

    const mobileOutput = await runAudit(page, 'mobile');
    const desktopOutput = await runAudit(page, 'desktop');

    if (mobileOutput && desktopOutput) {
      const mobileData = await parseReport(mobileOutput);
      const desktopData = await parseReport(desktopOutput);

      if (mobileData && desktopData) {
        auditResults.push({
          ...page,
          mobile: mobileData,
          desktop: desktopData,
        });
        console.log(`  ✅ Complete`);
      }
    }
  }

  console.log('\n📊 Generating summary report...');
  const summaryPath = await generateSummary(auditResults);

  console.log('\n✅ Audit Complete!\n');
  console.log(`Reports saved to: ${OUTPUT_DIR}`);
  console.log(`Summary: ${summaryPath}\n`);
  console.log(`To view summary:`);
  console.log(`  open ${summaryPath}\n`);
}

main().catch(console.error);

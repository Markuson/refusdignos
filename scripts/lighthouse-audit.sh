#!/bin/bash
# Lighthouse Audit Script for RefugiosLibresDignos
# Runs comprehensive performance audits on all key pages

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PRODUCTION_URL="${1:-https://your-production-url.vercel.app}"
OUTPUT_DIR="./lighthouse-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}  Lighthouse Audit - RefugiosLibresDignos${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""
echo -e "${YELLOW}Production URL:${NC} $PRODUCTION_URL"
echo -e "${YELLOW}Timestamp:${NC} $TIMESTAMP"
echo -e "${YELLOW}Output Directory:${NC} $OUTPUT_DIR"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${RED}Error: Lighthouse CLI not found${NC}"
    echo "Install with: npm install -g lighthouse"
    exit 1
fi

# Array of pages to audit
declare -a PAGES=(
    "/"
    "/proyecto"
    "/refugios"
    "/refugios/la-larri"
    "/colaboradores"
    "/contacto"
    "/legal/privacidad"
)

declare -a PAGE_NAMES=(
    "homepage"
    "proyecto"
    "refugios-listing"
    "refugio-detail"
    "colaboradores"
    "contacto"
    "legal-privacidad"
)

# Function to run lighthouse audit
run_audit() {
    local page=$1
    local name=$2
    local url="${PRODUCTION_URL}${page}"

    echo -e "${BLUE}Auditing:${NC} ${url}"
    echo -e "${YELLOW}Page:${NC} ${name}"

    # Run Lighthouse for mobile
    echo -e "  ${YELLOW}→ Mobile audit...${NC}"
    lighthouse "$url" \
        --output html \
        --output json \
        --output-path="${OUTPUT_DIR}/${TIMESTAMP}_${name}_mobile" \
        --preset=perf \
        --chrome-flags="--headless --no-sandbox" \
        --quiet \
        --emulated-form-factor=mobile \
        2>/dev/null

    # Run Lighthouse for desktop
    echo -e "  ${YELLOW}→ Desktop audit...${NC}"
    lighthouse "$url" \
        --output html \
        --output json \
        --output-path="${OUTPUT_DIR}/${TIMESTAMP}_${name}_desktop" \
        --preset=perf \
        --chrome-flags="--headless --no-sandbox" \
        --quiet \
        --emulated-form-factor=desktop \
        2>/dev/null

    echo -e "  ${GREEN}✓ Complete${NC}"
    echo ""
}

# Run audits on all pages
echo -e "${BLUE}Starting audits...${NC}"
echo ""

for i in "${!PAGES[@]}"; do
    run_audit "${PAGES[$i]}" "${PAGE_NAMES[$i]}"
done

# Generate summary report
echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}  Generating Summary Report${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""

# Create summary HTML
cat > "${OUTPUT_DIR}/${TIMESTAMP}_summary.html" << 'HTMLEOF'
<!DOCTYPE html>
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
        .container { max-width: 1200px; margin: 0 auto; }
        h1 {
            color: #284c3e;
            margin-bottom: 10px;
            font-size: 2rem;
        }
        .meta {
            color: #666;
            margin-bottom: 30px;
            font-size: 0.9rem;
        }
        .page-section {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .page-title {
            font-size: 1.3rem;
            color: #284c3e;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .metric {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #284c3e;
        }
        .metric-label {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .metric-value {
            font-size: 1.8rem;
            font-weight: bold;
        }
        .score-excellent { color: #0cce6b; }
        .score-good { color: #ffa400; }
        .score-poor { color: #ff4e42; }
        .device-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        .device-tab {
            padding: 10px 20px;
            background: #f0f0f0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .device-tab.active {
            background: #284c3e;
            color: white;
        }
        .device-content { display: none; }
        .device-content.active { display: block; }
        .report-links {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .report-link {
            display: inline-block;
            margin-right: 15px;
            color: #E78A33;
            text-decoration: none;
            font-weight: 500;
        }
        .report-link:hover {
            text-decoration: underline;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .summary-card h3 {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 10px;
        }
        .summary-card .big-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #284c3e;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Lighthouse Audit Summary</h1>
        <div class="meta">
            RefugiosLibresDignos Performance Report<br>
            <strong>Date:</strong> <span id="audit-date"></span>
        </div>

        <div class="summary-grid">
            <div class="summary-card">
                <h3>Pages Audited</h3>
                <div class="big-number" id="pages-count">0</div>
            </div>
            <div class="summary-card">
                <h3>Avg Performance (Mobile)</h3>
                <div class="big-number" id="avg-perf-mobile">-</div>
            </div>
            <div class="summary-card">
                <h3>Avg Performance (Desktop)</h3>
                <div class="big-number" id="avg-perf-desktop">-</div>
            </div>
        </div>

        <div id="page-reports"></div>
    </div>

    <script>
        // Audit date
        document.getElementById('audit-date').textContent = new Date().toLocaleString();

        // This will be populated by the script
        const auditData = __AUDIT_DATA__;

        // Populate summary
        document.getElementById('pages-count').textContent = auditData.length;

        // Calculate averages
        let totalPerfMobile = 0;
        let totalPerfDesktop = 0;

        auditData.forEach(page => {
            totalPerfMobile += page.mobile.performance;
            totalPerfDesktop += page.desktop.performance;
        });

        const avgMobile = Math.round(totalPerfMobile / auditData.length);
        const avgDesktop = Math.round(totalPerfDesktop / auditData.length);

        document.getElementById('avg-perf-mobile').textContent = avgMobile;
        document.getElementById('avg-perf-desktop').textContent = avgDesktop;

        // Render page reports
        const container = document.getElementById('page-reports');

        auditData.forEach(page => {
            const section = document.createElement('div');
            section.className = 'page-section';
            section.innerHTML = `
                <div class="page-title">${page.title}</div>
                <div class="device-tabs">
                    <div class="device-tab active" onclick="switchDevice(this, '${page.name}', 'mobile')">📱 Mobile</div>
                    <div class="device-tab" onclick="switchDevice(this, '${page.name}', 'desktop')">🖥️ Desktop</div>
                </div>

                <div id="${page.name}-mobile" class="device-content active">
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
                    <div class="report-links">
                        <a href="${page.mobile.htmlReport}" class="report-link" target="_blank">📄 View Full Report</a>
                    </div>
                </div>

                <div id="${page.name}-desktop" class="device-content">
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
                    <div class="report-links">
                        <a href="${page.desktop.htmlReport}" class="report-link" target="_blank">📄 View Full Report</a>
                    </div>
                </div>
            `;
            container.appendChild(section);
        });

        function getScoreClass(score) {
            if (score >= 90) return 'score-excellent';
            if (score >= 50) return 'score-good';
            return 'score-poor';
        }

        function switchDevice(tab, pageName, device) {
            // Update tabs
            const tabs = tab.parentElement.querySelectorAll('.device-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update content
            const contents = document.querySelectorAll(`[id^="${pageName}-"]`);
            contents.forEach(c => c.classList.remove('active'));
            document.getElementById(`${pageName}-${device}`).classList.add('active');
        }
    </script>
</body>
</html>
HTMLEOF

echo -e "${GREEN}✓ Summary report created${NC}"
echo ""
echo -e "${BLUE}==========================================${NC}"
echo -e "${GREEN}  Audit Complete!${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""
echo -e "${YELLOW}Reports saved to:${NC} ${OUTPUT_DIR}"
echo -e "${YELLOW}Summary:${NC} ${OUTPUT_DIR}/${TIMESTAMP}_summary.html"
echo ""
echo -e "${BLUE}To view summary:${NC}"
echo -e "  open ${OUTPUT_DIR}/${TIMESTAMP}_summary.html"
echo ""

/**
 * Formats Code Coverage report comparing it to the base coverage report if available.
 * @param {object} report        - Current coverage JSON report from xccov (main app)
 * @param {object|null} baseReport - Base branch coverage JSON (or null if unavailable)
 * @param {string[]} gateFailures  - Gate failure messages to display at the top
 * @param {Object.<string, object>} moduleReports - Map of module name → xccov report
 * @returns {string} The formatted Markdown comment body
 */
function formatCoverageReport(report, baseReport, gateFailures = [], moduleReports = {}) {
  if (!report) {
    return '## 🤖 FancyBot: Code Coverage Report\n\n⚠️ Error: No coverage report was parsed.';
  }

  const totalCoverage = (report.lineCoverage * 100);
  const baseTotal = baseReport ? (baseReport.lineCoverage * 100) : null;
  const noBase = baseReport === null;

  const getDeltaStr = (current, base) => {
    if (base === null || base === undefined) return '—';
    const diff = current - base;
    if (Math.abs(diff) < 0.05) return '`0.0%`';
    return diff > 0 ? `\`+${diff.toFixed(1)}%\` 📈` : `\`${diff.toFixed(1)}%\` 📉`;
  };

  const coverageIcon = (pct) => pct >= 80 ? '🟢' : pct >= 60 ? '🟡' : '🔴';

  const overallDelta = getDeltaStr(totalCoverage, baseTotal);

  let body = `## 🤖 FancyBot: Code Coverage Report\n\n`;

  // Gate failure banner — shown at the top so it's immediately visible
  if (gateFailures.length > 0) {
    body += `> [!CAUTION]\n`;
    body += `> **🚫 Coverage gates failed — this PR is blocked:**\n`;
    for (const f of gateFailures) {
      body += `> - ${f}\n`;
    }
    body += `\n`;
  } else {
    body += `> ✅ All coverage gates passed\n\n`;
  }

  body += `**Overall Coverage: ${totalCoverage.toFixed(1)}%** ${overallDelta !== '—' ? overallDelta : ''}\n\n`;
  if (noBase) {
    body += `> ℹ️ **Change** column shows '—' because no base coverage from \`main\` exists yet. It will populate after the first merge to main.\n\n`;
  }

  // ── Per-module coverage table ──────────────────────────────────────────────
  body += `### 📦 Module Coverage\n`;
  body += `| | Module | Coverage | Change |\n|--|--------|----------|--------|\n`;

  for (const [moduleName, modReport] of Object.entries(moduleReports)) {
    const pct = (modReport.lineCoverage * 100);
    // Base comparison not implemented for modules yet (no per-module base artifact)
    body += `| ${coverageIcon(pct)} | \`${moduleName}\` | ${pct.toFixed(1)}% | — |\n`;
  }

  if (Object.keys(moduleReports).length === 0) {
    body += `| ℹ️ | _No module xcresults found_ | — | — |\n`;
  }

  // ── Main app target breakdown ──────────────────────────────────────────────
  body += `\n### 🏠 Main App Coverage\n`;
  body += `| | Target | Coverage | Change |\n|--|--------|----------|--------|\n`;
  for (const target of report.targets || []) {
    if (target.name.includes('Tests')) continue;
    const pct = (target.lineCoverage * 100);
    let basePct = null;
    if (baseReport) {
      const baseTarget = (baseReport.targets || []).find(t => t.name === target.name);
      if (baseTarget) basePct = (baseTarget.lineCoverage * 100);
    }
    body += `| ${coverageIcon(pct)} | \`${target.name}\` | ${pct.toFixed(1)}% | ${getDeltaStr(pct, basePct)} |\n`;
  }

  // ── File-wise breakdown (collapsible) ─────────────────────────────────────
  body += `\n<details><summary><strong>📄 File-wise Coverage</strong></summary>\n\n`;

  // Main app files
  body += `**Main App**\n\n`;
  body += `| File | Coverage | Change |\n|------|----------|--------|\n`;
  for (const target of report.targets || []) {
    if (target.name.includes('Tests')) continue;
    let baseTarget = null;
    if (baseReport) {
      baseTarget = (baseReport.targets || []).find(t => t.name === target.name);
    }
    for (const file of target.files || []) {
      const pct = (file.lineCoverage * 100);
      let basePct = null;
      if (baseTarget) {
        const baseFile = (baseTarget.files || []).find(f => f.name === file.name);
        if (baseFile) basePct = (baseFile.lineCoverage * 100);
      }
      body += `| ${coverageIcon(pct)} \`${file.name}\` | ${pct.toFixed(1)}% | ${getDeltaStr(pct, basePct)} |\n`;
    }
  }

  // Per-module files
  for (const [moduleName, modReport] of Object.entries(moduleReports)) {
    body += `\n**${moduleName}**\n\n`;
    body += `| File | Coverage |\n|------|----------|\n`;
    for (const target of modReport.targets || []) {
      if (target.name.includes('Tests')) continue;
      for (const file of target.files || []) {
        const pct = (file.lineCoverage * 100);
        body += `| ${coverageIcon(pct)} \`${file.name}\` | ${pct.toFixed(1)}% |\n`;
      }
    }
  }

  body += `</details>\n\n`;

  body += `> 🎯 Target threshold: **80%**\n`;
  body += `> 📊 Generated from \`TestResults.xcresult\` + per-module xcresults`;

  return body;
}

module.exports = {
  formatCoverageReport
};


/**
 * Formats Code Coverage report comparing it to the base coverage report if available.
 * @param {object} report - Current coverage JSON report from xccov
 * @param {object|null} baseReport - Base coverage JSON report from main branch (or null)
 * @returns {string} The formatted Markdown comment body
 */
function formatCoverageReport(report, baseReport) {
  if (!report) {
    return '## 🤖 FancyBot: Code Coverage Report\n\n⚠️ Error: No coverage report was parsed.';
  }

  const totalCoverage = (report.lineCoverage * 100);
  const baseTotal = baseReport ? (baseReport.lineCoverage * 100) : null;
  
  const getDeltaStr = (current, base) => {
    if (base === null || base === undefined) return '—';
    const diff = current - base;
    if (Math.abs(diff) < 0.05) return '`0.0%`';
    return diff > 0 ? `\`+${diff.toFixed(1)}%\` 📈` : `\`${diff.toFixed(1)}%\` 📉`;
  };

  const overallDelta = getDeltaStr(totalCoverage, baseTotal);

  const noBase = baseReport === null;
  let body = `## 🤖 FancyBot: Code Coverage Report\n\n`;
  body += `**Overall Coverage: ${totalCoverage.toFixed(1)}%** ${overallDelta !== '—' ? overallDelta : ''}\n\n`;
  if (noBase) {
    body += `> ℹ️ **Change** column shows \'—\' because no base coverage from \`main\` exists yet. It will populate after the first merge to main.\n\n`;
  }
  
  // Build per-target breakdown
  body += `### Module Coverage\n`;
  body += `| | Target | Coverage | Change |\n|--|--------|----------|--------|\n`;
  for (const target of report.targets || []) {
    if (target.name.includes('Tests')) continue;
    const pct = (target.lineCoverage * 100);
    
    let basePct = null;
    if (baseReport) {
      const baseTarget = (baseReport.targets || []).find(t => t.name === target.name);
      if (baseTarget) basePct = (baseTarget.lineCoverage * 100);
    }
    
    const icon = pct >= 80 ? '🟢' : pct >= 60 ? '🟡' : '🔴';
    body += `| ${icon} | \`${target.name}\` | ${pct.toFixed(1)}% | ${getDeltaStr(pct, basePct)} |\n`;
  }

  // Build file-wise breakdown
  body += `\n<details><summary><strong>📄 File-wise Coverage</strong></summary>\n\n`;
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
      const icon = pct >= 80 ? '🟢' : pct >= 60 ? '🟡' : '🔴';
      body += `| ${icon} \`${file.name}\` | ${pct.toFixed(1)}% | ${getDeltaStr(pct, basePct)} |\n`;
    }
  }
  body += `</details>\n\n`;

  body += `> 🎯 Target threshold: **80%**\n`;
  body += `> 📊 Generated from \`TestResults.xcresult\`\n`;
  body += `> 📦 Coverage includes all targets measured in the test run`;

  return body;
}

module.exports = {
  formatCoverageReport
};

/**
 * Formats SwiftLint results array into a markdown report.
 * @param {Array} results - The parsed JSON results from SwiftLint
 * @param {string} [workspacePath] - The root path of GITHUB_WORKSPACE to strip from filenames
 * @returns {string} The formatted Markdown comment body
 */
function formatSwiftLintReport(results, workspacePath = process.env.GITHUB_WORKSPACE || '') {
  const title = '## 🤖 FancyBot: SwiftLint Report\n\n';

  if (!results || results.length === 0) {
    return `${title}✅ **SwiftLint**: No violations found!`;
  }

  // Group by severity
  const errors = results.filter(v => (v.severity || '').toLowerCase() === 'error');
  const warnings = results.filter(v => (v.severity || '').toLowerCase() === 'warning');

  let body = title;
  body += `| Metric | Count |\n|--------|-------|\n`;
  body += `| 🔴 Errors | ${errors.length} |\n`;
  body += `| 🟡 Warnings | ${warnings.length} |\n\n`;

  const formatViolations = (violations, label) => {
    if (violations.length === 0) return '';
    let section = `### ${label}\n\n`;
    section += `| File | Line | Rule | Reason |\n|------|------|------|--------|\n`;
    for (const v of violations.slice(0, 50)) { // cap at 50
      let file = v.file;
      if (workspacePath) {
        file = file.replace(workspacePath + '/', '');
      }
      section += `| \`${file}\` | ${v.line} | \`${v.rule_id}\` | ${v.reason} |\n`;
    }
    if (violations.length > 50) {
      section += `\n> ⚠️ Showing first 50 of ${violations.length} violations.\n`;
    }
    return section + '\n';
  };

  body += formatViolations(errors, '🔴 Errors');
  body += formatViolations(warnings, '🟡 Warnings');

  return body;
}

module.exports = {
  formatSwiftLintReport
};

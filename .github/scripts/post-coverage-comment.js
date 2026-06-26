const { execSync } = require('child_process');
const { readJson } = require('./helpers/file-utils');
const { formatCoverageReport } = require('./formatters/coverage-formatter');
const { postOrReplaceComment } = require('./helpers/github-comments');
const { checkCoverageGates } = require('./helpers/coverage-gates');

/**
 * Entry point for generating coverage report, comparing with base, and posting PR comment.
 * Throws an error (failing the CI step) if coverage gates are not met.
 * @param {object} params
 * @param {object} params.github
 * @param {object} params.context
 */
module.exports = async ({ github, context }) => {
  let raw = '{}';
  try {
    raw = execSync('xcrun xccov view --report --json TestResults.xcresult').toString();
  } catch (error) {
    console.error('Failed to parse xccov report:', error);
    return;
  }

  let report;
  try {
    report = JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse JSON representation of xccov report:', error);
    return;
  }

  const baseReport = readJson('base_coverage.json');

  const totalCoverage = (report.lineCoverage * 100);
  const baseTotal = baseReport ? (baseReport.lineCoverage * 100) : null;

  // Check gates before formatting so failures are embedded in the comment
  const { passed, failures } = checkCoverageGates(totalCoverage, baseTotal);

  const body = formatCoverageReport(report, baseReport, failures);

  await postOrReplaceComment({
    github,
    context,
    indicator: 'FancyBot: Code Coverage Report',
    body
  });

  // Fail the CI step AFTER the comment is posted so the PR always shows what went wrong
  if (!passed) {
    throw new Error(`Coverage gates failed:\n${failures.join('\n')}`);
  }
};


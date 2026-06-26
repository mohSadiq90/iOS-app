const { execSync } = require('child_process');
const { readJson } = require('./helpers/file-utils');
const { formatCoverageReport } = require('./formatters/coverage-formatter');
const { postOrReplaceComment } = require('./helpers/github-comments');
const { checkCoverageGates } = require('./helpers/coverage-gates');

const MODULES = ['NetworkUtility', 'CommonUI', 'LocalStorage'];

/**
 * Parses an xcresult bundle into a JSON coverage report, returning null on failure.
 * @param {string} xcresultPath
 * @returns {object|null}
 */
function parseXcresult(xcresultPath) {
  try {
    const raw = execSync(`xcrun xccov view --report --json ${xcresultPath}`, {
      stdio: ['pipe', 'pipe', 'pipe']
    }).toString();
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Entry point for generating coverage report, comparing with base, and posting PR comment.
 * Throws an error (failing the CI step) if coverage gates are not met.
 * @param {object} params
 * @param {object} params.github
 * @param {object} params.context
 */
module.exports = async ({ github, context }) => {
  // Parse main app coverage
  const report = parseXcresult('TestResults.xcresult');
  if (!report) {
    console.error('Failed to parse main app xccov report. Skipping coverage comment.');
    return;
  }

  // Parse each module's coverage from its own xcresult
  const moduleReports = {};
  for (const mod of MODULES) {
    const modReport = parseXcresult(`${mod}.xcresult`);
    if (modReport) {
      moduleReports[mod] = modReport;
    } else {
      console.warn(`No xcresult found for ${mod} — skipping module coverage.`);
    }
  }

  const baseReport = readJson('base_coverage.json');

  const totalCoverage = (report.lineCoverage * 100);
  const baseTotal = baseReport ? (baseReport.lineCoverage * 100) : null;

  // Check gates before formatting so failures appear in the comment body
  const { passed, failures } = checkCoverageGates(totalCoverage, baseTotal);

  const body = formatCoverageReport(report, baseReport, failures, moduleReports);

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



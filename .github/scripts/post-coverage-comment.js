const { execSync } = require('child_process');
const { readJson } = require('./helpers/file-utils');
const { formatCoverageReport } = require('./formatters/coverage-formatter');
const { postOrReplaceComment } = require('./helpers/github-comments');

/**
 * Entry point for generating coverage report, comparing with base, and posting PR comment.
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
  const body = formatCoverageReport(report, baseReport);

  await postOrReplaceComment({
    github,
    context,
    indicator: 'FancyBot: Code Coverage Report',
    body
  });
};

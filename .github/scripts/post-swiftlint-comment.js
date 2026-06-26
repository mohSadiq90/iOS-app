const { readJson } = require('./helpers/file-utils');
const { formatSwiftLintReport } = require('./formatters/swiftlint-formatter');
const { postOrReplaceComment } = require('./helpers/github-comments');

/**
 * Entry point for Posting/Updating SwiftLint report as a PR comment.
 * @param {object} params
 * @param {object} params.github
 * @param {object} params.context
 */
module.exports = async ({ github, context }) => {
  const results = readJson('swiftlint_results.json') || [];
  const body = formatSwiftLintReport(results);

  await postOrReplaceComment({
    github,
    context,
    indicator: 'FancyBot: SwiftLint Report',
    body
  });
};

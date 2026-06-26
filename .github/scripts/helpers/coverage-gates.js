// Coverage gate thresholds
const MIN_COVERAGE = 80;
const MAX_DROP = 4;

/**
 * Checks coverage gates.
 * @param {number} totalCoverage - Current coverage percentage (0-100)
 * @param {number|null} baseTotal - Base branch coverage percentage, or null if unavailable
 * @returns {{ passed: boolean, failures: string[] }}
 */
function checkCoverageGates(totalCoverage, baseTotal) {
  const failures = [];

  if (totalCoverage < MIN_COVERAGE) {
    failures.push(
      `🔴 Coverage is **${totalCoverage.toFixed(1)}%**, below the minimum threshold of **${MIN_COVERAGE}%**`
    );
  }

  if (baseTotal !== null && (baseTotal - totalCoverage) >= MAX_DROP) {
    const drop = (baseTotal - totalCoverage).toFixed(1);
    failures.push(
      `🔴 Coverage dropped by **${drop}%** (${baseTotal.toFixed(1)}% → ${totalCoverage.toFixed(1)}%), exceeding the maximum allowed drop of **${MAX_DROP}%**`
    );
  }

  return {
    passed: failures.length === 0,
    failures
  };
}

module.exports = { checkCoverageGates, MIN_COVERAGE, MAX_DROP };

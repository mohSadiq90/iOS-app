/**
 * Finds an existing bot comment containing the given indicator.
 * @param {object} github 
 * @param {object} context 
 * @param {string} indicator 
 * @returns {Promise<object|null>}
 */
async function findBotComment(github, context, indicator) {
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number
  });
  return comments.find(c => c.body.includes(indicator) && c.user.type === 'Bot') || null;
}

/**
 * Deletes a comment by ID.
 * @param {object} github 
 * @param {object} context 
 * @param {number} commentId 
 */
async function deleteComment(github, context, commentId) {
  await github.rest.issues.deleteComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    comment_id: commentId
  });
}

/**
 * Creates a new comment on the current PR.
 * @param {object} github 
 * @param {object} context 
 * @param {string} body 
 */
async function createComment(github, context, body) {
  await github.rest.issues.createComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
    body
  });
}

/**
 * High-level helper to post a PR comment, replacing any previous comment containing the indicator.
 * @param {object} params
 * @param {object} params.github
 * @param {object} params.context
 * @param {string} params.indicator
 * @param {string} params.body
 */
async function postOrReplaceComment({ github, context, indicator, body }) {
  if (!context.issue.number) {
    console.log('No active issue/PR number found. Skipping comment posting.');
    return;
  }

  const existing = await findBotComment(github, context, indicator);
  if (existing) {
    try {
      await deleteComment(github, context, existing.id);
    } catch (error) {
      console.warn(`Failed to delete existing comment ${existing.id}:`, error);
    }
  }

  await createComment(github, context, body);
}

module.exports = {
  findBotComment,
  deleteComment,
  createComment,
  postOrReplaceComment
};

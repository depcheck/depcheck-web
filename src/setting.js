function getSettings(env) {
  return new Promise((resolve, reject) => {
    // TODO web report only supports Travis CI and GitHub now
    if (env.TRAVIS === 'true') {
      return resolve({
        url: `/github/${env.TRAVIS_REPO_SLUG}`,
        branch: env.TRAVIS_BRANCH,
        pullRequest: env.TRAVIS_PULL_REQUEST === 'false'
          ? false
          : parseInt(env.TRAVIS_PULL_REQUEST, 10),
      });
    }

    return reject('Build environment is not supported yet, please report issue to https://github.com/depcheck/depcheck-web');
  });
}

function validatePullRequest(settings) {
  return new Promise((resolve, reject) =>
    settings.pullRequest
    ? reject('Skip posting depcheck report to web service because it runs in a pull request.')
    : resolve(settings));
}

export default (env) =>
  getSettings(env).then(validatePullRequest);

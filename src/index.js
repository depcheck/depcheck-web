import request from 'request';
import readStdin from './stdin';

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

function parseArgv(argv) {
  return new Promise(resolve =>
    resolve({
      report: argv[0] || '',
      baseUrl: argv[1] || 'https://depcheck.tk',
    }));
}

function postWebReport({
  token,
  baseUrl,
  url,
  branch,
  report,
  result,
  }) {
  return new Promise((resolve, reject) =>
    request({
      baseUrl,
      url,
      method: 'POST',
      json: true,
      body: {
        token,
        branch,
        report,
        result,
      },
    }, (err, res, body) => {
      if (err) {
        reject(err);
      } else if (res.statusCode !== 200) {
        reject(body);
      }

      resolve(result);
    }));
}

export default function main(argv, log, error, env, exit) {
  return Promise.all([
    readStdin().then(JSON.parse),
    getSettings(env).then(validatePullRequest),
    parseArgv(argv),
  ]).then(([result, settings, args]) => postWebReport({
    token: env.DEPCHECK_TOKEN,
    baseUrl: args.baseUrl,
    url: settings.url,
    branch: settings.branch,
    report: args.report,
    result,
  })).then(() => {
    log('Post web report succeed.');
    exit(0);
  }, message => {
    error(message);
    exit(-1);
  });
}

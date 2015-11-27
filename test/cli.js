import test from 'blue-tape';
import request from 'superagent';
import mocker from 'superagent-mocker';

import cli from '../src/cli';
import mockProcess from './process';

const mock = mocker(request);

const env = {
  TRAVIS: 'true',
  TRAVIS_REPO_SLUG: 'tester/project',
  TRAVIS_BRANCH: 'test',
  TRAVIS_PULL_REQUEST: 'false',
  DEPCHECK_TOKEN: 'project-token',
};

test('should post the input and succeed', assert => {
  assert.timeoutAfter(5000); // 5 seconds

  const processMocker = mockProcess({ env });

  mock.post('https://depcheck.tk/github/tester/project', () => null);
  return cli(processMocker)
    .then(() => assert.equal(processMocker.exit.value, 0))
    .then(() => assert.equal(processMocker.stdout.value, 'Post web report succeed.'))
    .then(() => assert.equal(processMocker.stderr.value, ''))
    .catch(error => assert.fail(error))
    .then(() => mock.clearRoutes());
});

test('should log error and exit with -1 when request failed', assert => {
  assert.timeoutAfter(5000); // 5 seconds

  const processMocker = mockProcess({ env });

  mock.post('https://depcheck.tk/github/tester/project', () => {
    throw { // eslint-disable-line no-throw-literal
      response: {
        body: 'error-body',
      },
    };
  });

  return cli(processMocker)
    .then(() => assert.equal(processMocker.exit.value, -1))
    .then(() => assert.equal(processMocker.stdout.value, ''))
    .then(() => assert.equal(processMocker.stderr.value, "'error-body'"))
    .catch(error => assert.fail(error))
    .then(() => mock.clearRoutes());
});

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
  assert.plan(7);

  const processMocker = mockProcess({
    env,
    input: 'project-result',
  });

  mock.post('https://depcheck.tk/github/tester/project', req => {
    assert.deepEqual(req.body.token, 'project-token');
    assert.deepEqual(req.body.branch, 'test');
    assert.deepEqual(req.body.report, '');
    assert.deepEqual(req.body.result, 'project-result');
  });

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

test('should pass the first CLI argument as report name', assert => {
  assert.timeoutAfter(5000); // 5 seconds
  assert.plan(2);

  const processMocker = mockProcess({
    env,
    argv: ['report'],
  });

  mock.post('https://depcheck.tk/github/tester/project', req =>
    assert.equal(req.body.report, 'report'));

  return cli(processMocker)
    .then(() => assert.equal(processMocker.exit.value, 0))
    .catch(error => assert.fail(error))
    .then(() => mock.clearRoutes());
});

test('should pass the second CLI argument as service URL', assert => {
  assert.timeoutAfter(5000); // 5 seconds

  const processMocker = mockProcess({
    env,
    argv: [null, 'https://depcheck.service'],
  });

  mock.post('https://depcheck.service/github/tester/project', () => null);

  return cli(processMocker)
    .then(() => assert.equal(processMocker.exit.value, 0))
    .catch(error => assert.fail(error))
    .then(() => mock.clearRoutes());
});

test('should handle any server-side exception', assert => {
  assert.timeoutAfter(5000); // 5 seconds

  const processMocker = mockProcess({
    env,
  });

  mock.post('https://depcheck.tk/github/tester/project', () => {
    throw new Error('message');
  });

  return cli(processMocker)
    .then(() => assert.equal(processMocker.exit.value, -1))
    .then(() => assert.equal(processMocker.stderr.value, '[Error: message]'))
    .catch(error => assert.fail(error))
    .then(() => mock.clearRoutes());
});

test('should skip post request when git provider is not supported', assert => {
  assert.timeoutAfter(5000); // 5 seconds

  const processMocker = mockProcess({
    env: {
      ...env,
      TRAVIS: undefined,
    },
  });

  mock.post('https://depcheck.tk/github/tester/project', () => null);

  return cli(processMocker)
    .then(() => assert.equal(processMocker.exit.value, 0))
    .then(() => assert.equal(processMocker.stdout.value, 'Build environment is not supported yet, please report issue to https://github.com/depcheck/depcheck-web'))
    .then(() => assert.equal(processMocker.stderr.value, ''))
    .catch(error => assert.fail(error))
    .then(() => mock.clearRoutes());
});

test('should skip post request when run in a pull request', assert => {
  assert.timeoutAfter(5000); // 5 seconds

  const processMocker = mockProcess({
    env: {
      ...env,
      TRAVIS_PULL_REQUEST: '123',
    },
  });

  mock.post('https://depcheck.tk/github/tester/project', () => null);

  return cli(processMocker)
    .then(() => assert.equal(processMocker.exit.value, 0))
    .then(() => assert.equal(processMocker.stdout.value, 'Skip posting depcheck report to web service because it runs in a pull request.'))
    .then(() => assert.equal(processMocker.stderr.value, ''))
    .catch(error => assert.fail(error))
    .then(() => mock.clearRoutes());
});

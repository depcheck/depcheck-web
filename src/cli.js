import readStream from './stream';
import getSettings from './setting';
import postWebReport from './index';
import { inspect } from 'util';

function parseArgv(argv) {
  return new Promise(resolve =>
    resolve({
      report: argv[2] || '', // empty string
      baseUrl: argv[3] || 'https://depcheck.tk',
    }));
}

export default function cli({ argv, stdin, stdout, stderr, env, exit }) {
  return Promise.all([
    readStream(stdin).then(JSON.parse),
    getSettings(env),
    parseArgv(argv),
  ]).then(([result, settings, args]) => postWebReport({
    token: env.DEPCHECK_TOKEN,
    baseUrl: args.baseUrl,
    url: settings.url,
    branch: settings.branch,
    report: args.report,
    result,
  })).then(() => {
    stdout.write('Post web report succeed.\n');
    exit(0);
  }, message => {
    if (message.exit === 0) { // HACK exit with zero with pull request
      stdout.write(message.message + '\n');
      exit(0);
    } else {
      stderr.write(inspect(message) + '\n');
      exit(-1);
    }
  });
}

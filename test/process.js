import str from 'string-to-stream';

function writable() {
  const storage = [];
  return {
    write(data) {
      storage.push(data);
    },
    get value() {
      return storage.join('');
    },
  };
}

function storeFunction() {
  let storage = null;

  function fn(value) {
    storage = value;
  }

  Object.defineProperty(fn, 'value', {
    get: () => storage,
  });

  return fn;
}

export default function mockProcess({
  argv = [],
  env = {},
  input = null,
  }) {
  return {
    argv: [null, null].concat(argv),
    env,
    stdin: str(JSON.stringify(input)),
    stdout: writable(),
    stderr: writable(),
    exit: storeFunction(),
  };
}

# depcheck-web

[![Build Status](https://travis-ci.org/depcheck/depcheck-web.svg?branch=master)](https://travis-ci.org/depcheck/depcheck-web)
[![Depcheck](https://depcheck.tk/github/depcheck/depcheck-web/master.svg)](https://github.com/depcheck/depcheck-web)

Post [depcheck](https://github.com/depcheck/depcheck) result to [depcheck service](https://depcheck.tk) and generate report and badge.

## Usage

1. Install [depcheck](https://www.npmjs.com/package/depcheck) and [depcheck-web](https://www.npmjs.com/package/depcheck-web) from npm.
2. Add `depcheck --json | depcheck-web` to script section in your `.travis.yml` file.

## Example

Check this project's [`.travis.yml`](https://github.com/depcheck/depcheck-web/blob/master/.travis.yml) file. It invokes the `npm run depcheck-web` command in script section.

Then, in [`package.json`](https://github.com/depcheck/depcheck-web/blob/master/package.json) file, `depcheck-web` script is defined as `depcheck --json | node ./bin/depcheck-web` (self-check) command.

## Known issues

- Currently, only Travis CI builds from GitHub provider is supported.

## License

MIT License.

'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');

const config = require('../config/webpack.config.dev');
const paths = require('../config/paths');

const useYarn = fs.existsSync(paths.yarnLockFile);

function build() {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      const messages = stats.compilation;

      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')));
      }

      try {
        fs.copySync(paths.appIndexHtml, paths.appBuildIndexHtml, {
          overwrite: true,
        });
      } catch (e) {
        return reject(e);
      }

      return resolve({
        stats,
        warnings: messages.warnings,
      });
    });
  });
}

fs.emptyDirSync(paths.appBuild);

build()
  .then(
    ({ stats, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
        console.log(chalk.green(stats));
      }
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      console.log((err.message || err) + '\n');
      process.exit(1);
    }
  );



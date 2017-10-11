'use strict';

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports= {
  appIndexHtml:   resolveApp('src/index.html'),

  // entry point(s)
  appIndexJs:     resolveApp('src/index.js'),

  // output dir
  appBuild:       resolveApp('build'),
  appBuildFonts:  'build/fonts/',
  appBuildIndexHtml: resolveApp('build/index.html'),

  // module resolution targets
  appSrc:         resolveApp('src'),
  appFonts:       resolveApp('assets/fonts'),
  appNodeModules: resolveApp('node_modules'),
};


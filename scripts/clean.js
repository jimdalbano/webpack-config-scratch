'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const paths = require('../config/paths');

fs.emptyDirSync(paths.appBuild);

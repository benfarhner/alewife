/**
 * @fileoverview Initializes recurring jobs.
 */

const path = require('path');
const Bree = require('bree');

const bree = new Bree({
  root: path.resolve('server/jobs'),
  jobs: [
    {
      name: 'update',
      path: path.join(__dirname, 'update.js'),
      interval: 'every 5 minutes'
    }
  ]
});

module.exports = bree;

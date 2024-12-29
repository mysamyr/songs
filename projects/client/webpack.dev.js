'use strict';
const common = require('./webpack.common.js');

module.exports = {
  ...common,
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
};

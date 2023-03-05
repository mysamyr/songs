"use strict";
const common = require("./webpack.common");

module.exports = {
  ...common,
  mode: "development",
  watch: true,
  devtool: "inline-source-map",
  module: {
    rules: []
  }
};

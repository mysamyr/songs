"use strict";
const common = require("./webpack.common");

module.exports = {
  ...common,
  mode: "production",
  module: {
    rules: []
  }
};

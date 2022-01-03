"use strict";

let path = require("path");

module.exports = {
  mode: "development",
  entry: "./public/app.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public", "dist"),
  },
  watch: true,
  devtool: "source-map",
  module: {
    rules: []
  }
};

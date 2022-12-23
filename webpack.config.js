"use strict";

module.exports = {
  mode: "production",
  entry: "./public/js/app.js",
  output: {
    filename: "bundle.js",
    path: require("path").resolve(__dirname, "public", "dist"),
  },
  watch: true,
  devtool: "source-map",
  module: {
    rules: []
  }
};

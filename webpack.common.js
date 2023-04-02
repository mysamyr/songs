"use strict";

module.exports = {
  mode: "production",
  entry: "./public/app.js",
  output: {
    filename: "bundle.js",
    path: require("path").resolve(__dirname, "public", "dist"),
    clean: true,
  },
  module: {
    rules: []
  }
};

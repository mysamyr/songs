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
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", {
              debug: true,
              corejs: 3,
              useBuiltIns: "usage"
            }]]
          }
        }
      }
    ]
  }
};

"use strict";
import common from "./webpack.common.js";

export default {
  ...common,
  mode: "development",
  watch: true,
  devtool: "inline-source-map",
};

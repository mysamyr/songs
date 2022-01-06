const {Schema, model} = require("mongoose");

const opts = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true
  },
}, opts);

module.exports = model("Categories", categoriesSchema);

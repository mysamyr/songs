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
  created_by: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date()
  }
}, opts);

module.exports = model("Categories", categoriesSchema);

const {Schema, model} = require("mongoose");

const opts = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
  collection: "song",
};

const songSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
    default: [],
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date()
  },
}, opts);

module.exports = model("Song", songSchema);

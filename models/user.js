const {Schema, model} = require("mongoose");

const opts = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, opts);

module.exports = model("User", userSchema);

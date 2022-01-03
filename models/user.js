const {Schema, model} = require("mongoose");

const opts = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
  collection: "user"
};

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
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

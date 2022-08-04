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
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
}, opts);

module.exports = model("User", userSchema);

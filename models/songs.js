const {Schema, model} = require("mongoose");

const opts = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
};

const homeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  category : {
    type: String,
    required: true
  }
}, opts);

homeSchema.method("toClient", function () {
  const course = this.toObject();

  course.id = course._id;
  delete course._id;

  return course;
});

module.exports = model("Songs", homeSchema);

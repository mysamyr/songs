const Joi = require("joi");

module.exports = {
  validator: require("./validator"),
  params: Joi.object({
    id: Joi.string()
      .alphanum()
      .length(24)
      .required(),
  }),
  category: {
    body: Joi.object({
      name: Joi.string()
        .trim()
        .required(),
    }),
  },
  song: {
    body: Joi.object({
      categories: Joi.array()
        .items(Joi.string()),
      name: Joi.string()
        .trim()
        .required(),
      text: Joi.string()
        .required(),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
    }),
  },
  register: {
    body: Joi.object({
      name: Joi.string()
        .trim()
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
      confirm: Joi.string()
        .required(),
    }),
  },
  changeEmail: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
    }),
  },
  changePassword: {
    body: Joi.object({
      password: Joi.string()
        .required(),
      newPassword: Joi.string()
        .required(),
      confirm: Joi.string()
        .required(),
    }),
  },
};

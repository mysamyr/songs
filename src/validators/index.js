const Joi = require("joi");

module.exports = {
  validator: require("./validator"),
  params: Joi.object({
    id: Joi.string()
      .length(24)
      .required(),
  }),
  category: {
    body: Joi.object({
      name: Joi.string()
        .trim()
        .min(5)
        .max(30)
        .required(),
    }),
  },
  song: {
    body: Joi.object({
      categories: [
        Joi.array()
          .items(Joi.string()
            .trim()
            .min(5)
            .max(30)
            .required()
            .messages({
              "string.empty": "Виберіть інші категорії, будь ласка",
              "string.min": "Виберіть інші категорії, будь ласка",
              "string.max": "Виберіть інші категорії, будь ласка",
            }))
          .required(),
        Joi.string()
          .trim()
          .min(5)
          .max(30)
          .required()
          .messages({
            "string.empty": "Виберіть іншу категорію, будь ласка",
            "string.min": "Виберіть іншу категорію, будь ласка",
            "string.max": "Виберіть іншу категорію, будь ласка",
          })
      ],
      name: Joi.string()
        .trim()
        .min(5)
        .max(30)
        .required()
        .messages({
          "string.empty": "Ім'я пісні не можу бути пустим",
          "string.min": "Ім'я пісні має містити як мінімум 5 символів",
          "string.max": "Ім'я пісні занадто довге",
        }),
      text: Joi.string()
        .required()
        .messages({
          "string.empty": "Текст пісні не можу бути пустим"
        }),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .trim()
        .required(),
    }),
  },
  register: {
    body: Joi.object({
      name: Joi.string()
        .trim()
        .min(4)
        .max(30)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
      confirm: Joi.ref("password"),
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
      newPassword: Joi.ref("password"),
      confirm: Joi.ref("password"),
    }),
  },
};

import Joi from 'joi';

export const categorySchema = Joi.string()
  .trim()
  .lowercase()
  .min(4)
  .max(30)
  .required();

export const createCategoryBody = Joi.object({
  name: categorySchema.messages({
    'any.required': 'Введіть назву категорії',
    'string.empty': 'Введіть назву категорії',
    'string.min': 'Введіть щонайменше 4 символи',
    'string.max': 'Назва категорії занадто довга',
  }),
}).required();

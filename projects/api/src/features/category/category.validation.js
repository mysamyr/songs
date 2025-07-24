import Joi from 'joi';
import { nameRegex } from '../../validators/index.js';
import { CATEGORY } from '../../constants/validation.js';

export const categorySchema = Joi.string()
  .trim()
  .lowercase()
  .min(CATEGORY.MIN)
  .max(CATEGORY.MAX)
  .regex(nameRegex)
  .required();

export const categoryBody = Joi.object({
  name: categorySchema.messages({
    'any.required': 'Введіть назву категорії',
    'string.empty': 'Введіть назву категорії',
    'string.min': 'Назва категорії занадто коротка',
    'string.max': 'Назва категорії занадто довга',
    'string.pattern.base': 'Введено недозволені символи',
  }),
}).required();

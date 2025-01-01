import Joi from 'joi';
import { nameRegex } from '../../validators/index.js';

export const categorySchema = Joi.string()
  .trim()
  .lowercase()
  .min(4)
  .max(30)
  .regex(nameRegex)
  .required();

export const categoryBody = Joi.object({
  name: categorySchema.messages({
    'any.required': 'Введіть назву категорії',
    'string.empty': 'Введіть назву категорії',
    'string.min': 'Введіть щонайменше 4 символи',
    'string.max': 'Назва категорії занадто довга',
    'string.pattern.base': 'Введено недозволені символи',
  }),
}).required();

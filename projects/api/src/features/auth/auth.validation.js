import Joi from 'joi';
import { email, password } from '../../validators/index.js';
import { USER_NAME } from '../../constants/validation.js';

const name = Joi.string()
  .trim()
  .min(USER_NAME.MIN)
  .max(USER_NAME.MAX)
  .required()
  .messages({
    'any.required': 'Введіть імʼя',
    'string.empty': 'Введіть імʼя',
    'string.min': 'Імʼя занадто коротке',
    'string.max': 'Імʼя занадто довге',
  });

export const login = Joi.object({
  email,
  password,
});

export const registration = Joi.object({
  name,
  email,
  password,
});

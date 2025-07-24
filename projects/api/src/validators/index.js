import Joi from 'joi';
import { USER_PASSWORD } from '../constants/validation.js';
import { PAGINATION_LIMIT } from '../constants/index.js';

export const defaultParams = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.empty': 'Невірний ідентифікатор',
    'string.hex': 'Невірний ідентифікатор',
    'string.length': 'Невірний ідентифікатор',
  }),
});
export const defaultPaginationQuery = Joi.object({
  skip: Joi.number().integer().optional().default(0),
  limit: Joi.number().integer().optional().default(PAGINATION_LIMIT),
  search: Joi.string().optional().allow(''),
});
export const email = Joi.string().email().required().messages({
  'any.required': 'Введіть email',
  'string.empty': 'Введіть email',
  'string.email': 'Невірний email',
});
export const password = Joi.string()
  .trim()
  .min(USER_PASSWORD.MIN)
  .max(USER_PASSWORD.MAX)
  .required()
  .messages({
    'any.required': 'Введіть пароль',
    'string.empty': 'Введіть пароль',
    'string.min': `Мінімальна довжина паролю - ${USER_PASSWORD.MIN} символів`,
    'string.max': `Пароль не може бути довшим ${USER_PASSWORD.MAX} символів`,
  });

export const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ 0-9_\-.,!]*$/;

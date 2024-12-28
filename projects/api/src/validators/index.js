import Joi from 'joi';

export const defaultParams = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.empty': 'Невірний ідентифікатор',
    'string.hex': 'Невірний ідентифікатор',
    'string.length': 'Невірний ідентифікатор',
  }),
});
export const email = Joi.string().email().required().messages({
  'any.required': 'Введіть email',
  'string.empty': 'Введіть email',
  'string.email': 'Невірний email',
});
export const password = Joi.string().trim().min(8).max(30).required().messages({
  'any.required': 'Введіть пароль',
  'string.empty': 'Введіть пароль',
  'string.min': 'Мінімальна довжина паролю - 8 символів',
  'string.max': 'Пароль не може бути довшим 30-ти символів',
});

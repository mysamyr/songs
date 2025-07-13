import Joi from 'joi';
import { categorySchema } from '../category/category.validation.js';
import { nameRegex } from '../../validators/index.js';
import { SONG_NAME, SONG_TEXT } from '../../constants/validation.js';

export const songBody = Joi.object({
  categories: Joi.array()
    .items(
      categorySchema.messages({
        'any.required': 'Виберіть категорію',
        'string.empty': 'Невірна категорія',
        'string.min': 'Виберіть іншу категорію, будь ласка',
        'string.max': 'Виберіть іншу категорію, будь ласка',
      })
    )
    .required(),
  name: Joi.string()
    .trim()
    .lowercase()
    .min(SONG_NAME.MIN)
    .max(SONG_NAME.MAX)
    .regex(nameRegex)
    .required()
    .messages({
      'any.required': 'Введіть назву пісні',
      'string.empty': 'Назва пісні не можу бути пустою',
      'string.min': `Назва пісні має містити як мінімум ${SONG_NAME.MIN} символи`,
      'string.max': 'Назва пісні занадто довга',
      'string.pattern.base': 'Введено недозволені символи',
    }),
  text: Joi.string()
    .trim()
    .min(SONG_TEXT.MIN)
    .max(SONG_TEXT.MAX)
    .required()
    .messages({
      'any.required': 'Введіть текст пісні',
      'string.empty': 'Текст пісні не можу бути пустим',
      'string.min': 'Текст пісні занадто коротка',
      'string.max': 'Текст пісні занадто довга',
    }),
});

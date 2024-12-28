import Joi from 'joi';
import { categorySchema } from '../category/category.validation.js';

const song = Joi.object({
  categories: [
    Joi.array()
      .items(
        categorySchema.messages({
          'any.required': 'Виберіть категорію',
          'string.empty': 'Невірна категорія',
          'string.min': 'Виберіть іншу категорію, будь ласка',
          'string.max': 'Виберіть іншу категорію, будь ласка',
        })
      )
      .required(),
    categorySchema.messages({
      'any.required': 'Виберіть категорію',
      'string.empty': 'Невірна категорія',
      'string.min': 'Виберіть іншу категорію, будь ласка',
      'string.max': 'Виберіть іншу категорію, будь ласка',
    }),
  ],
  name: Joi.string().trim().min(4).max(30).required().messages({
    'any.required': 'Введіть назву пісні',
    'string.empty': 'Назва пісні не можу бути пустою',
    'string.min': 'Назва пісні має містити як мінімум 4 символи',
    'string.max': 'Назва пісні занадто довга',
  }),
  text: Joi.string().required().messages({
    'any.required': 'Введіть текст пісні',
    'string.empty': 'Текст пісні не можу бути пустим',
  }),
});

export const addSongQuery = Joi.object({
  current: Joi.string().trim().lowercase().optional(),
  name: Joi.string().trim().lowercase().optional(),
  text: Joi.string().trim().optional(),
});

// todo update messages
export const addSongBody = song;

export const editSongBody = song;

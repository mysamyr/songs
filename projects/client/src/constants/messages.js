import { CATEGORY, PASSWORD, SONG, SONG_TEXT } from './index';

export const BACK_HOME = 'На головну';
export const BACK = 'Назад';
export const BACK_TO_CATEGORIES = 'До категорій';
export const EMPTY_CATEGORY_NAME = 'Назва категорії не може бути порожньою';
export const SAME_CATEGORY_NAME = 'Назва категорії не змінилась';
export const SHORT_CATEGORY_NAME = `Назва категорії має містити мінімум ${CATEGORY.MIN} символів`;
export const LONG_CATEGORY_NAME = `Назва категорії має містити максимум ${CATEGORY.MAX} символів`;
export const ALL_FIELDS_REQUIRED = "Всі поля є обов'язковими";
export const NO_CATEGORY_SELECTED = 'Виберіть щонайменше одну категорію';
export const SHORT_SONG_NAME = `Назва пісні має містити мінімум ${SONG.MIN} символів`;
export const LONG_SONG_NAME = `Назва пісні має містити максимум ${SONG.MAX} символів`;
export const SHORT_SONG_TEXT = `Текст пісні має містити мінімум ${SONG_TEXT.MIN} символів`;
export const LONG_SONG_TEXT = `Текст пісні має містити максимум ${SONG_TEXT.MAX} символів`;
export const EMPTY_EMAIL = 'Електронна пошта не може бути порожньою';
export const NOT_SAME_PASSWORDS = 'Паролі не співпадають';
export const SHORT_PASSWORD = `Пароль має містити мінімум ${PASSWORD.MIN} символів`;

import { CATEGORY, SONG, SONG_TEXT } from '../constants';

// eslint-disable-next-line no-console
export const logError = e => console.error(e);

// eslint-disable-next-line eqeqeq
export const isNil = value => value == null; // null or undefined

export const capitalizeFirstLetter = value =>
  value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const validateCategory = (name, oldName) => {
  if (!name.length) {
    return 'Назва категорії не може бути порожньою';
  }

  if (oldName && name === oldName) {
    return 'Назва категорії не змінилась';
  }

  if (name.length < CATEGORY.MIN) {
    return `Назва категорії має містити мінімум ${CATEGORY.MIN} символів`;
  }

  if (name.length > CATEGORY.MAX) {
    return `Назва категорії має містити максимум ${CATEGORY.MAX} символів`;
  }
};

export const validateSong = (categories, name, text) => {
  if (!name.length || !text.length) {
    return "Всі поля є обов'язковими";
  }
  if (!categories.length) {
    return 'Виберіть щонайменше одну категорію';
  }

  if (name.length < SONG.MIN) {
    return `Назва пісні має містити мінімум ${SONG.MIN} символів`;
  }
  if (name.length > SONG.MAX) {
    return `Назва пісні має містити максимум ${SONG.MAX} символів`;
  }

  if (text.length < SONG_TEXT.MIN) {
    return `Текст пісні має містити мінімум ${SONG_TEXT.MIN} символів`;
  }
  if (text.length > SONG_TEXT.MAX) {
    return `Текст пісні має містити максимум ${SONG_TEXT.MAX} символів`;
  }
};

import { CATEGORY, SONG, SONG_TEXT } from '../constants';
import {
  ALL_FIELDS_REQUIRED,
  EMPTY_CATEGORY_NAME,
  LONG_CATEGORY_NAME,
  LONG_SONG_NAME,
  LONG_SONG_TEXT,
  NO_CATEGORY_SELECTED,
  SAME_CATEGORY_NAME,
  SHORT_CATEGORY_NAME,
  SHORT_SONG_NAME,
  SHORT_SONG_TEXT,
} from '../constants/messages';

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
    return EMPTY_CATEGORY_NAME;
  }

  if (oldName && name === oldName) {
    return SAME_CATEGORY_NAME;
  }

  if (name.length < CATEGORY.MIN) {
    return SHORT_CATEGORY_NAME;
  }

  if (name.length > CATEGORY.MAX) {
    return LONG_CATEGORY_NAME;
  }
};

export const validateSong = (categories, name, text) => {
  if (!name.length || !text.length) {
    return ALL_FIELDS_REQUIRED;
  }
  if (!categories.length) {
    return NO_CATEGORY_SELECTED;
  }

  if (name.length < SONG.MIN) {
    return SHORT_SONG_NAME;
  }
  if (name.length > SONG.MAX) {
    return LONG_SONG_NAME;
  }

  if (text.length < SONG_TEXT.MIN) {
    return SHORT_SONG_TEXT;
  }
  if (text.length > SONG_TEXT.MAX) {
    return LONG_SONG_TEXT;
  }
};

import {
  ALL_FIELDS_REQUIRED,
  EMPTY_CATEGORY_NAME,
  EMPTY_EMAIL,
  LONG_CATEGORY_NAME,
  LONG_PASSWORD,
  LONG_SONG_NAME,
  LONG_SONG_TEXT,
  NO_CATEGORY_SELECTED,
  NOT_SAME_PASSWORDS,
  SAME_CATEGORY_NAME,
  SHORT_CATEGORY_NAME,
  SHORT_PASSWORD,
  SHORT_SONG_NAME,
  SHORT_SONG_TEXT,
} from '../constants/messages';
import {
  CATEGORY,
  SONG_NAME,
  SONG_TEXT,
  USER_NAME,
  USER_PASSWORD,
} from '../constants/validation';
import {
  NAME_IS_REQUIRED,
  NAME_TOO_LONG,
  NAME_TOO_SHORT,
} from '../pages/Auth/messages';

export const getCategoryError = (name, oldName) => {
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

export const validateCategory = (name, oldName) => {
  const validationError = getCategoryError(name.trim(), oldName);
  if (validationError) return { error: validationError };
  return {
    value: {
      name: name.trim().toLowerCase(),
    },
  };
};

const getSongError = (categories, name, text) => {
  if (!name.length || !text.length) {
    return ALL_FIELDS_REQUIRED;
  }
  if (!categories.length) {
    return NO_CATEGORY_SELECTED;
  }

  if (name.length < SONG_NAME.MIN) {
    return SHORT_SONG_NAME;
  }
  if (name.length > SONG_NAME.MAX) {
    return LONG_SONG_NAME;
  }

  if (text.length < SONG_TEXT.MIN) {
    return SHORT_SONG_TEXT;
  }
  if (text.length > SONG_TEXT.MAX) {
    return LONG_SONG_TEXT;
  }
};

export const validateSong = (categories, name, text) => {
  const validationError = getSongError(categories, name.trim(), text.trim());
  if (validationError) return { error: validationError };
  return {
    value: {
      categories,
      name: name.trim().toLowerCase(),
      text: text.trim(),
    },
  };
};

const getRegistrationError = (name, email, password, confirm) => {
  if (!name.length) {
    return NAME_IS_REQUIRED;
  }
  if (name < USER_NAME.MIN) {
    return NAME_TOO_SHORT;
  }
  if (name > USER_NAME.MAX) {
    return NAME_TOO_LONG;
  }
  if (!email.length) {
    return EMPTY_EMAIL;
  }
  if (
    password.length < USER_PASSWORD.MIN ||
    confirm.length < USER_PASSWORD.MIN
  ) {
    return SHORT_PASSWORD;
  }
  if (
    password.length > USER_PASSWORD.MAX ||
    confirm.length > USER_PASSWORD.MAX
  ) {
    return LONG_PASSWORD;
  }
  if (password !== confirm) {
    return NOT_SAME_PASSWORDS;
  }
};

export const validateRegistration = (name, email, password, confirm) => {
  const validationError = getRegistrationError(
    name.trim(),
    email,
    password,
    confirm
  );
  if (validationError) return { error: validationError };
  return {
    value: {
      name: name.trim(),
      email,
      password,
    },
  };
};

const getLoginError = (email, password) => {
  if (!email.length) {
    return EMPTY_EMAIL;
  }
  if (password.length < USER_PASSWORD.MIN) {
    return SHORT_PASSWORD;
  }
  if (password.length > USER_PASSWORD.MAX) {
    return LONG_PASSWORD;
  }
};

export const validateLogin = (email, password) => {
  const validationError = getLoginError(email, password);
  if (validationError) return { error: validationError };
  return {
    value: {
      email,
      password,
    },
  };
};

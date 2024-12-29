// eslint-disable-next-line no-console
export const logError = e => console.error(e);

// eslint-disable-next-line eqeqeq
export const isNil = value => value == null; // null or undefined

export const capitalizeFirstLetter = value =>
  value.charAt(0).toUpperCase() + value.slice(1);

// eslint-disable-next-line no-console
export const logError = e => console.error(e);

// eslint-disable-next-line eqeqeq
export const isNil = value => value == null; // null or undefined

export const capitalizeFirstLetter = value =>
  value
    .split(' ')
    .map((word, idx) =>
      !idx || word.length > 1
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(' ');

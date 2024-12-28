import { FIELD_TYPES, LIST_ITEM_LENGTH, SORT_DIRECTIONS } from '../constants';
import {
  NAME_IS_EMPTY,
  NAME_IS_TOO_LONG,
  NAME_IS_TOO_SHORT,
  NOT_VALID_NUMBER_$,
  NOT_VALID_STRING_$,
} from '../constants/error-messages';

// eslint-disable-next-line no-console
export const logError = e => console.error(e);

// eslint-disable-next-line eqeqeq
export const isNil = value => value == null; // null or undefined

export const capitalizeFirstLetter = value =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const validateName = name => {
  if (!name.length) {
    return NAME_IS_EMPTY;
  }
  if (name.length < LIST_ITEM_LENGTH.MIN) {
    return NAME_IS_TOO_SHORT;
  }
  if (name.length > LIST_ITEM_LENGTH.MAX) {
    return NAME_IS_TOO_LONG;
  }
};

export const getListItemValuesFromForm = (fields, form) =>
  fields.map(({ description, type, min, max }, idx) => {
    if (type === FIELD_TYPES.BOOLEAN) {
      return form[`${idx}`].checked;
    }
    const value = form[`${idx}`].value.trim();
    if (type === FIELD_TYPES.NUMBER) {
      if (
        isNaN(value) ||
        (!isNil(min) && value < min) ||
        (!isNil(max) && value > max)
      ) {
        throw new Error(NOT_VALID_NUMBER_$({ description, min, max }));
      }
      return +value;
    }
    if (value.length < min || (!isNil(max) && value.length > max)) {
      throw new Error(NOT_VALID_STRING_$({ description, min, max }));
    }
    return value;
  });

export const sortByValue = ({ lists, listItems, sort, direction }) => {
  const sortedLists = [...lists].sort((x, y) => x.name.localeCompare(y.name));
  const sortedListItems = [...listItems].sort((x, y) => {
    if (typeof x.data[sort] === 'string' && typeof y.data[sort] === 'string') {
      return x.data[sort].localeCompare(y.data[sort]);
    }
    return x.data[sort] - y.data[sort];
  });
  if (direction === SORT_DIRECTIONS.DESC) {
    sortedListItems.reverse();
  }
  return {
    lists: sortedLists,
    listItems: sortedListItems,
  };
};

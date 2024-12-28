import { isNil } from '../utils/helpers';

export const NAME_IS_EMPTY = 'Name cannot be empty';
export const NAME_IS_TOO_SHORT = 'Name is too short';
export const NAME_IS_TOO_LONG = 'Name is too long';
export const NO_DESTINATION_LISTS = 'No destination lists.';
export const SAME_NAME = "Name wasn't changed";
export const INCORRECT_SORT = 'Sort field is incorrect';
export const NO_FIELDS = 'Config should include at least one field';
export const NOT_UNIQUE_FIELD = 'Fields should be unique';
export const NO_MIN_FIELD_$ = name =>
  `String field '${name}' should have at least min value`;
export const NO_MIN_MAX_IN_FIELD_$ = name =>
  `Boolean field '${name}' shouldn't have min/max values`;
export const NO_NEGATIVE_MIN_MAX_IN_FIELD_$ = name =>
  `String field '${name}' shouldn't have negative min/max value`;
export const NO_GREATER_MIN_IN_FIELD_$ = name =>
  `In '${name}' field 'max' should be greater than 'min'`;
export const NOT_VALID_STRING_$ = ({ description, min, max }) =>
  `Field '${description}' should be a string and contain min ${min} ${!isNil(max) ? 'and max ' + max : ''} characters`;
export const NOT_VALID_NUMBER_$ = ({ description, min, max }) =>
  `Field '${description}' should be a number that ${!isNil(min) ? 'min ' + min : ''} ${!isNil(min) && !isNil(max) ? 'and' : ''} ${!isNil(max) ? 'max ' + max : ''}`;

export const UNKNOWN_TYPE = 'Unknown type';

export const PAGES = {
  LOGIN: '/login',
  LISTS: '/lists',
  LIST: id => `/lists/${id}`,
  LIST_URL: '/lists/:listId',
  LIST_ITEM_DATA: (id, itemId) => `/lists/${id}/items/${itemId}`,
  LIST_ITEM_URL: '/lists/:listId/items/:listItemId',
  ERROR: '/error',
  NEW_LIST: '/lists/new/',
  CONFIGS: '/configs',
  CONFIG: id => `/configs/${id}`,
  CONFIG_URL: '/configs/:configId',
  NEW_CONFIG: '/configs/new',
  CABINET: '/cabinet',
  ACTIVATE: '/auth/activate/:activationId',
  RECOVERY: '/auth/recovery/:activationId',
};

export const API_URLS = {
  ACTIVATE_$: id => `/auth/activate/${id}`,
  SIGNIN: '/auth/login',
  SIGNUP: '/auth/signup',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  CHECK_ACTIVATION_ID: id => `/auth/check/${id}`,
  FORGOT_PASSWORD: '/auth/forgot-password',
  PASSWORD_RECOVER: id => `/auth/recovery/${id}`,
  CHANGE_EMAIL: '/auth/email',
  CHANGE_PASSWORD: '/auth/password',
  DELETE_ACCOUNT: '/auth',

  GET_ROOT_LISTS: '/lists',
  GET_LISTS_TREE_$: id => `/lists/${id}/tree`,
  GET_LISTS_$: id => `/lists/${id}`,
  GET_LIST_ITEM_DATA_$: (id, itemId) => `/lists/${id}/items/${itemId}`,
  CREATE_NEW_ENTRY_LIST: '/lists',
  CREATE_NEW_LIST_$: id => `/lists/${id}`,
  CREATE_NEW_LIST_ITEM_$: id => `/lists/${id}/items`,
  UPDATE_LIST_$: id => `/lists/${id}`,
  UPDATE_LIST_ITEM_$: (id, itemId) => `/lists/${id}/items/${itemId}`,
  MOVE_LIST_$: id => `/lists/${id}/move`,
  CLEAR_LIST_ITEMS_$: id => `/lists/${id}/clear`,
  DELETE_LIST_$: id => `/lists/${id}`,
  DELETE_LIST_ITEM_$: (id, itemId) => `/lists/${id}/items/${itemId}`,

  GET_CONFIGS: '/configs',
  GET_CONFIG_DATA_$: id => `/configs/${id}`,
  CREATE_NEW_CONFIG: '/configs',
  UPDATE_CONFIG_$: id => `/configs/${id}`,
  DELETE_CONFIG_$: id => `/configs/${id}`,
};

export const LIST_ITEM_LENGTH = {
  MIN: 2,
  MAX: 50,
};

export const FIELD_TYPES = {
  STRING: 'str',
  NUMBER: 'num',
  BOOLEAN: 'bool',
};

export const FIELD_TYPE_NAMES = {
  [FIELD_TYPES.STRING]: 'String',
  [FIELD_TYPES.NUMBER]: 'Number',
  [FIELD_TYPES.BOOLEAN]: 'Boolean',
};

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

export const HEADER_ICONS = {
  BACK: 'back',
  MENU: 'menu',
  SORT: 'sort',
  EDIT: 'edit',
};

export const PASSWORD = {
  MIN: 8,
  MAX: 30,
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  GATEWAY_TIMEOUT: 504,
};

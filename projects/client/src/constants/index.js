export const PAGES = {
  HOME: '/',
  AUTH: '/auth',
  LITURGY: '/lit',
  PANAKHYDA: '/pan',
  CABINET: '/cabinet',
  CATEGORIES: '/category',
  CATEGORY: '/category/:id',
  CATEGORY_$: id => `/category/${id}`,
  NEW_CATEGORY: '/category/new',
  SONG: '/song/:id',
  SONG_$: id => `/song/${id}`,
  NEW_SONG: '/song/new',
  EDIT_SONG: '/song/:id/edit',
  EDIT_SONG_$: id => `/song/${id}/edit`,
  ACTIVATED: '/auth/verify/:id',
  ERROR: '/error',
};

export const API_URLS = {
  ACTIVATE_$: id => `/auth/activate/${id}`,
  SIGNIN: '/auth/login',
  SIGNUP: '/auth/signup',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',

  CHANGE_EMAIL: '/cabinet/email',
  CHANGE_PASSWORD: '/cabinet/password',
  RESEND_VALIDATION: '/cabinet/validation',
  DELETE_ACCOUNT: '/cabinet',

  GET_CATEGORIES: '/category',
  GET_CATEGORY: id => `/category/${id}`,
  CREATE_CATEGORY: '/category',
  RENAME_CATEGORY: id => `/category/${id}`,
  DELETE_CATEGORY: id => `/category/${id}`,

  GET_SONG: id => `/song/${id}`,
  CREATE_SONG: '/song',
  EDIT_SONG: id => `/song/${id}`,
  DELETE_SONG: id => `/song/${id}`,
};

export const PASSWORD = {
  MIN: 8,
  MAX: 30,
};

export const CATEGORY = {
  MIN: 4,
  MAX: 30,
};

export const SONG = {
  MIN: 4,
  MAX: 30,
};

export const SONG_TEXT = {
  MIN: 10,
  MAX: 4096,
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

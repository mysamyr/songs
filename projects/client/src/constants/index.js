export const PAGES = {
  HOME: '/',
  AUTH: '/auth',
  LITURGY: '/lit',
  PANAKHYDA: '/pan',
  VINCHANNIA: '/vin',
  CABINET: '/cabinet',
  CATEGORIES: '/category',
  ALL_SONGS: '/category/all',
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

const API_PREFIX = '/api';

export const API_URLS = {
  ACTIVATE_$: id => `${API_PREFIX}/auth/activate/${id}`,
  LOGIN: `${API_PREFIX}/auth/login`,
  SIGNUP: `${API_PREFIX}/auth/signup`,
  REFRESH: `${API_PREFIX}/auth/refresh`,
  LOGOUT: `${API_PREFIX}/auth/logout`,

  CHANGE_EMAIL: `${API_PREFIX}/cabinet/email`,
  CHANGE_PASSWORD: `${API_PREFIX}/cabinet/password`,
  RESEND_VALIDATION: `${API_PREFIX}/cabinet/validation`,
  DELETE_ACCOUNT: `${API_PREFIX}/cabinet`,

  GET_CATEGORIES: `${API_PREFIX}/category`,
  GET_CATEGORY: id => `${API_PREFIX}/category/${id}`,
  CREATE_CATEGORY: `${API_PREFIX}/category`,
  RENAME_CATEGORY: id => `${API_PREFIX}/category/${id}`,
  DELETE_CATEGORY: id => `${API_PREFIX}/category/${id}`,

  GET_ALL_SONGS: `${API_PREFIX}/song`,
  GET_SONG: id => `${API_PREFIX}/song/${id}`,
  CREATE_SONG: `${API_PREFIX}/song`,
  EDIT_SONG: id => `${API_PREFIX}/song/${id}`,
  DELETE_SONG: id => `${API_PREFIX}/song/${id}`,
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

export const PAGINATION_LIMIT = 15;

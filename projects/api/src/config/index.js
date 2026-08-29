import '../utils/dotenv.js';
import { PRODUCTION } from '../constants/index.js';

export const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const PORT = +process.env.PORT || 8080;
export const URL = process.env.URL ?? `http://localhost:${PORT}/`;

export const MONGODB_URL =
  process.env.MONGODB_URL ?? 'mongodb://localhost:27017/songs';
export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME ?? 'songs';

export const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY;
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;

export const SEND_EMAIL = process.env.SEND_EMAIL;
export const EMAIL_API_KEY = process.env.EMAIL_API_KEY;

export const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT || 5000;
export const HEADERS_TIMEOUT = +process.env.HEADERS_TIMEOUT || 2000;
export const KEEP_ALIVE_TIMEOUT = +process.env.KEEP_ALIVE_TIMEOUT || 3000;
export const SERVER_TIMEOUT = +process.env.SERVER_TIMEOUT || 60000;

if (NODE_ENV === PRODUCTION) {
  if (!JWT_ACCESS_KEY) {
    throw new Error('JWT_ACCESS_KEY is not defined');
  }
  if (!JWT_REFRESH_KEY) {
    throw new Error('JWT_REFRESH_KEY is not defined');
  }
  if (!SEND_EMAIL) {
    throw new Error('SEND_EMAIL is not defined');
  }
  if (!EMAIL_API_KEY) {
    throw new Error('EMAIL_API_KEY is not defined');
  }
}

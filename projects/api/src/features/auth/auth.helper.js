import jwt from 'jsonwebtoken';
import { Token } from '../../models/index.js';
import { UnauthorizedError } from '../../utils/error.js';
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from '../../config/index.js';

const generateAccessToken = data =>
  jwt.sign(data, JWT_ACCESS_KEY, { expiresIn: '5m' });

const generateRefreshToken = data =>
  jwt.sign(data, JWT_REFRESH_KEY, { expiresIn: '15d' });

export const generateTokens = async id => {
  const accessToken = generateAccessToken({ id });
  const refreshToken = generateRefreshToken({ id });

  await Token.create({ token: refreshToken, userId: id });

  return {
    accessToken,
    refreshToken,
  };
};

export const checkRefreshToken = async token => {
  const userData = jwt.verify(token, JWT_REFRESH_KEY);
  if (!userData) {
    throw UnauthorizedError();
  }
  return userData;
};

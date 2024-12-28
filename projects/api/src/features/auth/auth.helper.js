import { sign } from 'jsonwebtoken';
import { Token } from '../../models/index.js';

const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = process.env;

const generateAccessToken = data =>
  sign(data, JWT_ACCESS_KEY, { expiresIn: '5m' });

const generateRefreshToken = data =>
  sign(data, JWT_REFRESH_KEY, { expiresIn: '15d' });

export const generateTokens = async (id, email) => {
  const accessToken = generateAccessToken({ id, email });
  const refreshToken = generateRefreshToken({ id });

  await Token.create({ token: refreshToken, userId: id });

  return {
    accessToken,
    refreshToken,
  };
};

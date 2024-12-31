import STATUS_CODES from '../../constants/status-codes.js';
import {
  NOT_EXISTING_USER,
  WRONG_EMAIL_OR_PASSWORD,
  PASSWORDS_NOT_MATCH,
  EXISTING_USER,
  ALREADY_ACTIVATED,
} from '../../constants/error-messages.js';
import { Token, User } from '../../models/index.js';
import { sendAuthorisationEmail } from '../../services/mail.js';
import { getLinkForVerification } from '../cabinet/cabinet.helper.js';
import { compare, hash, uuid } from '../../utils/crypto.js';
import { BadRequest, UnauthorizedError } from '../../utils/error.js';
import { checkRefreshToken, generateTokens } from './auth.helper.js';

export const login = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  const candidate = await User.findOne({
    email,
  }).exec();
  if (!candidate) {
    throw BadRequest(NOT_EXISTING_USER);
  }

  const isSame = compare(password, candidate.password);
  if (!isSame) {
    throw BadRequest(WRONG_EMAIL_OR_PASSWORD);
  }

  const { accessToken, refreshToken } = await generateTokens(candidate._id);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });

  return res.status(STATUS_CODES.OK).json({
    name: candidate.name,
    isAdmin: candidate.is_admin,
    verified: candidate.verified,
    accessToken,
  });
};

export const register = async (req, res) => {
  const { name, email, password, confirm } = req.body;
  if (password !== confirm) {
    throw BadRequest(PASSWORDS_NOT_MATCH);
  }
  const candidate = await User.findOne({ email }).exec();
  if (candidate) {
    throw BadRequest(EXISTING_USER);
  }

  const link = uuid();
  await User.create({
    email,
    name,
    password: hash(password),
    link,
  });

  await sendAuthorisationEmail({
    email,
    name,
    url: getLinkForVerification(link),
  });

  return res.status(STATUS_CODES.OK).send();
};

export const refresh = async (req, res) => {
  const userData = await checkRefreshToken(req.cookies.refreshToken);

  const dbToken = await Token.findOneAndDelete({
    token: req.cookies.refreshToken,
  });
  if (!dbToken) {
    throw UnauthorizedError();
  }

  const candidate = await User.findById(userData.id)
    .select('name email')
    .exec();

  const { accessToken, refreshToken } = await generateTokens(candidate._id);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });

  res.status(STATUS_CODES.OK).json({ accessToken });
};

export const logout = async (req, res) => {
  await Token.findOneAndDelete({ token: req.cookies.refreshToken });

  res.clearCookie('refreshToken');

  return res.status(STATUS_CODES.OK).send();
};

export const verify = async (req, res) => {
  const candidate = await User.findOneAndUpdate(
    { link: req.params.id },
    { verified: true }
  );
  if (!candidate) {
    throw BadRequest(ALREADY_ACTIVATED);
  }

  return res.status(STATUS_CODES.OK).send();
};

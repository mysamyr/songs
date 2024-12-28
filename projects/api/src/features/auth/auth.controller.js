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
import ApiError from '../../utils/error.js';
import { generateTokens } from './auth.helper.js';

export const login = async (req, res) => {
  const {
    body: { email, password },
  } = req;

  const candidate = await User.findOne({
    email,
  }).exec();
  if (!candidate) {
    throw new ApiError.BadRequest(NOT_EXISTING_USER);
  }

  const isSame = compare(password, candidate.password);
  if (!isSame) {
    throw new ApiError.BadRequest(WRONG_EMAIL_OR_PASSWORD);
  }

  const { accessToken, refreshToken } = await generateTokens(
    candidate._id,
    email
  );

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });

  return res.status(STATUS_CODES.OK).json({ accessToken, refreshToken });
};

export const register = async (req, res) => {
  const { name, email, password, confirm } = req.body;
  if (password !== confirm) {
    throw new ApiError.BadRequest(PASSWORDS_NOT_MATCH);
  }
  const candidate = await User.findOne({ email }).exec();
  if (candidate) {
    throw new ApiError.BadRequest(EXISTING_USER);
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
    throw new ApiError.BadRequest(ALREADY_ACTIVATED);
  }

  return res.status(STATUS_CODES.OK).send();
};

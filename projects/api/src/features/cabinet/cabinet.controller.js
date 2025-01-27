import STATUS_CODES from '../../constants/status-codes.js';
import {
  VALIDATE_ACCOUNT,
  EXISTING_EMAIL,
  WRONG_PASSWORD,
  PASSWORDS_MATCH,
  ALREADY_ACTIVATED,
  VERIFY_TRY_AGAIN,
  ACCOUNT_NOT_DELETED,
} from '../../constants/error-messages.js';
import { Token, User } from '../../models/index.js';
import {
  sendUpdateEmail,
  sendUpdatePassword,
  sendAuthorisationEmail,
} from '../../services/mail.js';
import { getLinkForVerification } from './cabinet.helper.js';
import { timeDiff } from '../../utils/time.js';
import { compare, hash, uuid } from '../../utils/crypto.js';
import { BadRequest } from '../../utils/error.js';

export const changeEmail = async (req, res) => {
  const {
    body: { email },
    userData,
  } = req;

  const currentEmail = userData.email;
  if (email === currentEmail) {
    throw BadRequest(EXISTING_EMAIL);
  }
  const link = uuid();

  await User.findByIdAndUpdate(userData._id, {
    email,
    verified: false,
    link,
  });

  await sendUpdateEmail({
    email,
    name: userData.name,
    url: getLinkForVerification(link),
  });

  res.clearCookie('refreshToken');

  return res.status(STATUS_CODES.OK).send();
};

export const changePassword = async (req, res) => {
  const {
    userData,
    body: { password, newPassword },
  } = req;

  if (!userData.verified) {
    throw BadRequest(VALIDATE_ACCOUNT);
  }
  const candidate = await User.findById(userData._id).select('password').exec();

  const isPasswordValid = compare(password, candidate.password);
  if (!isPasswordValid) {
    throw BadRequest(WRONG_PASSWORD);
  }

  if (compare(newPassword, candidate.password)) {
    throw BadRequest(PASSWORDS_MATCH);
  }

  await User.findByIdAndUpdate(userData._id, {
    password: hash(newPassword),
  });

  await sendUpdatePassword({ email: userData.email });

  return res.status(STATUS_CODES.OK).send();
};

export const resendVerification = async (req, res) => {
  const { _id, verified } = req.userData;

  if (verified) {
    throw BadRequest(ALREADY_ACTIVATED);
  }

  const currentTime = new Date();
  const DBUser = await User.findById(_id).exec();

  // if was sent inside 5 minutes
  if (timeDiff(currentTime, DBUser.verify_sent_at) < 300000) {
    throw BadRequest(VERIFY_TRY_AGAIN);
  }

  await User.findByIdAndUpdate(_id, { verify_sent_at: currentTime });

  await sendAuthorisationEmail({
    email: DBUser.email,
    name: DBUser.name,
    url: getLinkForVerification(DBUser.link),
  });

  return res.status(STATUS_CODES.OK).send();
};

export const deleteAccount = async (req, res) => {
  const userData = await User.findByIdAndDelete(req.userData._id).exec();

  if (!userData) {
    throw BadRequest(ACCOUNT_NOT_DELETED);
  }

  await Token.findOneAndDelete({ user: userData._id }).exec();

  res.clearCookie('refreshToken');

  return res.status(STATUS_CODES.OK).send();
};

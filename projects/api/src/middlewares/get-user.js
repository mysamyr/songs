import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
import logger from '../services/logging.js';
import { JWT_ACCESS_KEY } from '../config/index.js';

export default async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const { id: userId } = jwt.verify(token, JWT_ACCESS_KEY);
      const userData = await userModel.findById(userId).exec();
      if (!userData) throw new Error();
      req.userData = userData;
      return next();
    } catch {
      logger.debug('Invalid token or user not found');
    }
  }
  req.userData = {};
  return next();
};

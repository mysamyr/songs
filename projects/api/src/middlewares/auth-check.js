import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../utils/error.js';
import userModel from '../models/user.js';

export default async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(UnauthorizedError());
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(UnauthorizedError());
  }
  try {
    const data = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    const userData = await userModel.findById(data.id).exec();
    if (!userData) throw new Error();
    req.userData = userData;
  } catch {
    next(ForbiddenError());
  }
  next();
};

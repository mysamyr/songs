import { verify } from 'jsonwebtoken';
import ApiError from '../utils/error.js';
import userModel from '../models/user';

export default async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(ApiError.UnauthorizedError());
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return next(ApiError.UnauthorizedError());
  }
  try {
    const data = verify(token, process.env.JWT_ACCESS_KEY);
    const userData = await userModel.findById(data.id).exec();
    if (!userData) throw new Error();
    req.userData = userData;
  } catch {
    next(ApiError.ForbiddenError());
  }
  next();
};

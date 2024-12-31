import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error();
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new Error();
    const data = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    const userData = await userModel.findById(data.id).exec();
    if (!userData) throw new Error();
    req.userData = userData;
  } catch {
    req.userData = {};
  }
  next();
};

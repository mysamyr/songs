import Router from 'express';
import authMiddleware from '../../middlewares/auth-check.js';
import promisify from '../../middlewares/promisify.js';
import { validateBody } from '../../middlewares/express-validators.js';
import { login, registration } from './auth.validation.js';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/login', validateBody(login), promisify(authController.login));

router.get('/logout', authMiddleware, promisify(authController.logout));

router.post(
  '/register',
  validateBody(registration),
  promisify(authController.register)
);

router.get('/verify/:id', promisify(authController.verify));

export default router;

import Router from 'express';
import promisify from '../../middlewares/promisify.js';
import { validateBody } from '../../middlewares/express-validators.js';
import { login, registration } from './auth.validation.js';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/login', validateBody(login), promisify(authController.login));

router.post(
  '/signup',
  validateBody(registration),
  promisify(authController.register)
);

router.get('/refresh', promisify(authController.refresh));

router.get('/logout', promisify(authController.logout));

router.get('/activate/:id', promisify(authController.verify));

export default router;

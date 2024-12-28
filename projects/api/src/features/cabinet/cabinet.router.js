import Router from 'express';
import authMiddleware from '../../middlewares/auth-check.js';
import promisify from '../../middlewares/promisify.js';
import { validateBody } from '../../middlewares/express-validators.js';
import { changeEmail, changePassword } from './cabinet.validation.js';
import * as cabinetController from './cabinet.controller.js';

const router = Router();

router.post(
  '/email',
  authMiddleware,
  validateBody(changeEmail.body),
  promisify(cabinetController.changeEmail)
);

router.post(
  '/password',
  authMiddleware,
  validateBody(changePassword.body),
  promisify(cabinetController.changePassword)
);

router.get(
  '/resend',
  authMiddleware,
  promisify(cabinetController.resendVerification)
);

router.delete('/', authMiddleware, promisify(cabinetController.deleteAccount));

export default router;

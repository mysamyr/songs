import Router from 'express';
import promisify from '../../middlewares/promisify.js';
import { validateBody } from '../../middlewares/express-validators.js';
import { changeEmail, changePassword } from './cabinet.validation.js';
import * as cabinetController from './cabinet.controller.js';

const router = Router();

router.post(
  '/email',
  validateBody(changeEmail.body),
  promisify(cabinetController.changeEmail)
);

router.post(
  '/password',
  validateBody(changePassword.body),
  promisify(cabinetController.changePassword)
);

router.get('/validation', promisify(cabinetController.resendVerification));

router.delete('/', promisify(cabinetController.deleteAccount));

export default router;

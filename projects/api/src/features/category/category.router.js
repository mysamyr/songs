import Router from 'express';
import authMiddleware from '../../middlewares/auth-check.js';
import promisify from '../../middlewares/promisify.js';
import {
  validateBody,
  validateParams,
} from '../../middlewares/express-validators.js';
import { defaultParams } from '../../validators/index.js';
import { createCategoryBody } from './category.validation.js';
import * as categoryController from './category.controller.js';

const router = Router();

router.get('/', promisify(categoryController.getCategories));

router.get(
  '/:id',
  validateParams(defaultParams),
  promisify(categoryController.getCategory)
);

router.post(
  '/',
  authMiddleware,
  validateBody(createCategoryBody),
  promisify(categoryController.addCategory)
);

router.delete(
  '/:id',
  authMiddleware,
  validateParams(defaultParams),
  promisify(categoryController.deleteCategory)
);

export default router;

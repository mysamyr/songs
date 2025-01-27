import Router from 'express';
import authMiddleware from '../../middlewares/auth-check.js';
import promisify from '../../middlewares/promisify.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../middlewares/express-validators.js';
import {
  defaultParams,
  defaultPaginationQuery,
} from '../../validators/index.js';
import { categoryBody } from './category.validation.js';
import * as categoryController from './category.controller.js';

const router = Router();

router.get(
  '/',
  validateQuery(defaultPaginationQuery),
  promisify(categoryController.getCategories)
);

router.get(
  '/:id',
  validateParams(defaultParams),
  validateQuery(defaultPaginationQuery),
  promisify(categoryController.getCategory)
);

router.post(
  '/',
  authMiddleware,
  validateBody(categoryBody),
  promisify(categoryController.addCategory)
);

router.put(
  '/:id',
  authMiddleware,
  validateParams(defaultParams),
  validateBody(categoryBody),
  promisify(categoryController.renameCategory)
);

router.delete(
  '/:id',
  authMiddleware,
  validateParams(defaultParams),
  promisify(categoryController.deleteCategory)
);

export default router;

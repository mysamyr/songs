import Router from 'express';
import authMiddleware from '../../middlewares/auth-check.js';
import promisify from '../../middlewares/promisify.js';
import {
  validateBody,
  validateParams,
} from '../../middlewares/express-validators.js';
import { defaultParams } from '../../validators/index.js';
import { createCategoryBody, editCategoryBody } from './category.validation.js';
import * as categoryController from './category.controller.js';

const router = Router();

router.get('/', promisify(categoryController.getCategories));

router.get(
  '/:id',
  authMiddleware,
  validateParams(defaultParams),
  promisify(categoryController.getSongsForCategory)
);

router.post(
  '/',
  authMiddleware,
  validateBody(createCategoryBody),
  promisify(categoryController.addCategory)
);

// todo normal body validation
router.put(
  '/:id',
  authMiddleware,
  validateParams(defaultParams),
  validateBody(editCategoryBody),
  promisify(categoryController.renameCategory)
);

router.delete(
  '/:id',
  authMiddleware,
  validateParams(defaultParams),
  promisify(categoryController.deleteCategory)
);

export default router;

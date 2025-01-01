import Router from 'express';
import authMiddleware from '../../middlewares/auth-check.js';
import getUserMiddleware from '../../middlewares/get-user.js';
import promisify from '../../middlewares/promisify.js';
import {
  validateBody,
  validateParams,
} from '../../middlewares/express-validators.js';
import { defaultParams } from '../../validators/index.js';
import { addSongBody, editSongBody } from './song.validation.js';
import * as songController from './song.controller.js';

const router = Router();

router.get(
  '/:id',
  validateParams(defaultParams),
  getUserMiddleware,
  promisify(songController.getSong)
);

router.post(
  '/',
  validateBody(addSongBody),
  authMiddleware,
  promisify(songController.addSong)
);

router.put(
  '/:id',
  validateParams(defaultParams),
  validateBody(editSongBody),
  authMiddleware,
  promisify(songController.editSong)
);

router.delete(
  '/:id',
  validateParams(defaultParams),
  authMiddleware,
  promisify(songController.deleteSong)
);

export default router;

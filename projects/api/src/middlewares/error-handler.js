import logger from '../services/logging.js';
import STATUS_CODES from '../constants/status-codes.js';
import ApiError from '../utils/error.js';

export default (err, req, res, _next) => {
  if (!err) {
    return res.status(STATUS_CODES.NOT_FOUND).send();
  }
  if (err instanceof ApiError) {
    logger.error(err);
    return res.status(err.status).json({ message: err.message });
  }
  if (err.code === 11000) {
    logger.error({ ...err, message: 'Element already exists' });
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: 'Element already exists' });
  }
  logger.error(err);
  return res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: 'Unexpected error' });
};

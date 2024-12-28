import ApiError from '../utils/error';
import logger from '../services/logging';

const validate = (entity, schema) => (req, res, next) => {
  const { error, value } = schema.validate(req[entity]);
  if (!error) {
    req[entity] = value;
    return next();
  }

  const message = error.details[0].message;
  logger.error(message);
  throw ApiError.BadRequest(message);
};

export const validateParams = schema => (req, res, next) =>
  validate('params', schema)(req, res, next);
export const validateBody = schema => (req, res, next) =>
  validate('body', schema)(req, res, next);
export const validateQuery = schema => (req, res, next) =>
  validate('query', schema)(req, res, next);

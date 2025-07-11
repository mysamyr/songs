import { BadRequest } from '../utils/error.js';
import logger from '../services/logging.js';

const validate = (entity, schema) => (req, res, next) => {
  const { error, value } = schema.validate(req[entity]);
  if (error) {
    logger.error(error);
    const message = error.details[0].message;
    throw BadRequest(message);
  }
  if (entity === 'body') {
    // we can replace body entity completely
    req[entity] = value;
  } else {
    // params and query are always objects and it is forbidden to set req.query in Express v5
    Object.entries(value).forEach(([key, val]) => {
      req[entity][key] = val;
    });
  }
  return next();
};

export const validateParams = schema => (req, res, next) =>
  validate('params', schema)(req, res, next);
export const validateBody = schema => (req, res, next) =>
  validate('body', schema)(req, res, next);
export const validateQuery = schema => (req, res, next) =>
  validate('query', schema)(req, res, next);

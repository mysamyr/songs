import { timestamp } from '../utils/time.js';
import logging from '../services/logging.js';

export default (req, res, next) => {
  const start = timestamp();

  res.on('finish', () =>
    logging.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${timestamp() - start}ms`
    )
  );

  next();
};

import { format, createLogger, transports } from 'winston';
import { PRODUCTION } from '../constants/index.js';
import { NODE_ENV } from '../config/index.js';

const logger = createLogger({
  level: 'http',
  format: format.combine(
    format.errors({ stack: true }),
    ...(NODE_ENV !== PRODUCTION ? [format.colorize()] : []),
    format.timestamp(),
    format.printf(
      ({ level, message, timestamp, stack }) =>
        `${timestamp} ${level}: ${message} ${stack || ''}`
    )
  ),
  transports: [new transports.Console()],
});

if (NODE_ENV !== PRODUCTION) {
  logger.add(
    new transports.File({
      format: format.combine(
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
        )
      ),
      filename: 'logs/list.log',
    })
  );
  logger.add(
    new transports.File({
      level: 'error',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message, stack }) =>
            `${timestamp} ${level}: ${message} ${stack || ''}`
        )
      ),
      filename: 'logs/errors.log',
    })
  );
}

export default logger;

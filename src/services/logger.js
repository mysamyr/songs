import { format, createLogger, transports } from 'winston';
import { PRODUCTION } from '../constants/index.js';

const logger = createLogger({
  level: 'http',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [new transports.Console()],
});

if (process.env.NODE_ENV !== PRODUCTION) {
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
        format.timestamp(),
        format.printf(
          ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
        )
      ),
      filename: 'logs/errors.log',
    })
  );
}

export default logger;

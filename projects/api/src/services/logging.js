import { format, createLogger, transports } from 'winston';
import { ApiError } from '../utils/error.js';

// todo normal error logger for development
const logger = createLogger({
  level: 'http',
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize(),
    format.timestamp(),
    format.printf(info => {
      if (info instanceof ApiError) {
        return `${info.timestamp} ${info.level}: ${info.message}`;
      }
      if (info instanceof Error) {
        return `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: [new transports.Console()],
});

// if (process.env.NODE_ENV !== PRODUCTION) {
//   logger.add(
//     new transports.File({
//       format: format.combine(
//         format.timestamp(),
//         format.printf(
//           ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
//         )
//       ),
//       filename: 'logs/list.log',
//     })
//   );
//   logger.add(
//     new transports.File({
//       level: 'error',
//       format: format.combine(
//         format.errors({ stack: true }),
//         format.timestamp(),
//         format.printf(
//           ({ timestamp, level, message, stack }) =>
//             `${timestamp} ${level}: ${message} ${stack || ''}`
//         )
//       ),
//       filename: 'logs/errors.log',
//     })
//   );
// }

export default logger;

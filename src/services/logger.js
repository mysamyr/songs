const { format, createLogger, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.json(),
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({format: format.simple()})
  );
  logger.add(
    new transports.File({ filename: "logs/list.log" })
  );
  logger.add(
    new transports.File({ level: "error", filename: "logs/errors.log" })
  );
}
const requestLogger = (req) => {
  logger.log({
    level: "info",
    message: JSON.stringify({
      url: req.url,
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString(),
    }),
  });
};
const errorLogger = (err) => {
  logger.error(err);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger,
};

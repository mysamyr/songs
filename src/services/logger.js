const { format, createLogger, transports } = require("winston");
const { PRODUCTION } = require("../constants");

const logger = createLogger({
	level: "info",
	format: format.json(),
});

logger.add(
	new transports.Console({
		format: format.simple(),
	}),
);

if (process.env.NODE_ENV !== PRODUCTION) {
	logger.add(
		new transports.File({
			filename: "logs/list.log",
		}),
	);
	logger.add(
		new transports.File({
			level: "error",
			filename: "logs/errors.log",
		}),
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
const errorLogger = (error) => {
	logger.error(
		JSON.stringify({
			error,
			timestamp: new Date().toISOString(),
		}),
	);
};

module.exports = {
	logger,
	requestLogger,
	errorLogger,
};

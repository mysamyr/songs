import { format, createLogger, transports } from "winston";
import { PRODUCTION } from "../constants/index.js";

export const logger = createLogger({
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

export const requestLogger = (req) => {
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

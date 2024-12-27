import { format, createLogger, transports } from "winston";
import { PRODUCTION } from "../constants/index.js";

const logger = createLogger({
	level: "info",
	format: format.json(),
	transports: [
		new transports.Console({
			format: format.simple(),
		}),
	],
});

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

export default logger;

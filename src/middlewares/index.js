import { TITLES } from "../constants/index.js";
import {
	VALIDATE_ACCOUNT,
	LOGGED_IN,
	LOGIN_PLEASE,
} from "../constants/error-messages.js";
import { requestLogger, logger } from "../services/logger.js";

export const auth = (req, res, next) => {
	if (!req.session.isAuthenticated) {
		logger.error(LOGIN_PLEASE);
		req.flash("err", LOGIN_PLEASE);
		return res.redirect("/auth/login");
	}
	next();
};

export const promisify = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

export const h404 = (req, res, next) =>
	res.status(404).render("404", {
		title: TITLES["404"],
		err: "Сталася помилка серверу",
	});

// variable for client to know that user is logged in
export const variable = (req, res, next) => {
	res.locals.isAuth = req.session.isAuthenticated;
	res.locals.isAdmin = req.session.isAdmin;
	res.locals.userName = req.session.user?.name;
	next();
};

export const noAuth = (req, res, next) => {
	if (req.session.isAuthenticated) {
		logger.error(LOGGED_IN);
		req.flash("msg", LOGGED_IN);
		return res.redirect("/");
	}
	next();
};

export const isAccountValid = (req, res, next) => {
	if (!req.session.isValidated) {
		req.flash("err", VALIDATE_ACCOUNT);
		return res.redirect("/category");
	}
	next();
};

export const requestLoggerMiddleware = (req, res, next) => {
	requestLogger(req);
	next();
};

export const errorHandler = (err, req, res, next) => {
	if (err.error && err.error.stack.includes("ValidationError")) {
		logger.error(err.error.stack);
	} else {
		logger.error(err.message);
	}
	next();
};

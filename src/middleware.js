const { TITLES } = require("./constants");
const {
	VALIDATE_ACCOUNT,
	LOGGED_IN,
	LOGIN_PLEASE,
} = require("./constants/error-messages");
const { requestLogger, errorLogger } = require("./services/logger");

module.exports = {
	auth: (req, res, next) => {
		if (!req.session.isAuthenticated) {
			errorLogger(LOGIN_PLEASE);
			req.flash("err", LOGIN_PLEASE);
			return res.redirect("/auth/login");
		}
		next();
	},
	promisify: (fn) => (req, res, next) =>
		Promise.resolve(fn(req, res, next)).catch(next),
	h404: (req, res, next) =>
		res.status(404).render("404", {
			title: TITLES["404"],
			err: "Сталася помилка серверу",
		}),
	// variable for client to know that user is logged in
	variable: (req, res, next) => {
		res.locals.isAuth = req.session.isAuthenticated;
		res.locals.isAdmin = req.session.isAdmin;
		res.locals.userName = req.session.user?.name;
		next();
	},
	noAuth: (req, res, next) => {
		if (req.session.isAuthenticated) {
			errorLogger(LOGGED_IN);
			req.flash("msg", LOGGED_IN);
			return res.redirect("/");
		}
		next();
	},
	isValid: (req, res, next) => {
		if (!req.session.isValidated) {
			req.flash("err", VALIDATE_ACCOUNT);
			return res.redirect("/category");
		}
		next();
	},
	requestLoggerMiddleware: (req, res, next) => {
		requestLogger(req);
		next();
	},
	errorHandler: (err, req, res, next) => {
		if (err.error && err.error.stack.includes("ValidationError")) {
			errorLogger(err.error.stack);
		} else {
			errorLogger(err.message);
		}
		next();
	},
};

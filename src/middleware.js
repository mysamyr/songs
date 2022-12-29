const {
  VALIDATE_ACCOUNT,
  LOGGED_IN,
  LOGIN_PLEASE,
} = require("./constants/error-messages");
const { logger, requestLogger, errorLogger } = require("./services/logger");

module.exports = {
  auth: (req, res, next) => {
    if (!req.session.isAuthenticated) {
      logger.error(LOGIN_PLEASE);
      req.flash("msg", LOGIN_PLEASE);
      return res.redirect("/auth/login");
    }
    next();
  },
  promisify: (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next),
  h404: (req, res, next) =>
    res.status(404).render("404", {
      title: "Page not found",
    }),
  // variable for client to know that user is logged in
  variable: (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated;
    res.locals.userName = req.session.user?.name;
    next();
  },
  noAuth: (req, res, next) => {
    if (req.session.isAuthenticated) {
      logger.error(LOGGED_IN);
      req.flash("msg", LOGGED_IN);
      return res.redirect("/");
    }
    next();
  },
  isValid: (req, res, next) => {
    if (!req.session.isValidated) {
      req.flash("msg", VALIDATE_ACCOUNT);
      return res.redirect("/category");
    }
    next();
  },
  requestLoggerMiddleware: (req, res, next) => {
    requestLogger(req);
    next();
  },
  errorHandler: (err, req, res, next) => {
    console.log(err);
    if (err.error && err.error.includes("ValidationError")) {
      errorLogger(err.error);
    } else {
      errorLogger(err.message);
    }
    next();
  },
};

const { VALIDATE_ACCOUNT, LOGGED_IN, LOGIN_PLEASE } = require("./constants/error-messages");

module.exports = {
  auth: (req, res, next) => {
  if (!req.session.isAuthenticated) {
    req.flash("msg", LOGIN_PLEASE);
    return res.redirect("/auth/login");
  }
  next();
},
  promisify: (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
  h404: (req, res, next) => {
    res.status(404).render("404", {
      title: "Page not found"
    });
  },
  // variable for client to know that user is logged in
  variable: (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated;
    next();
  },
  noAuth: (req, res, next) => {
    if (req.session.isAuthenticated) {
      req.flash("msg", LOGGED_IN);
      return res.redirect("/");
    }
    next();
  },
  isValid: (req, res, next) => {
    if (!req.session.isValidated) {
      req.flash("msg", VALIDATE_ACCOUNT);
      return res.redirect("/");
    }
    next();
  },
};

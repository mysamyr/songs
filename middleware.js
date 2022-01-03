const { LOGGED_IN } = require("./constants");

const auth = function(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect("/auth/login");
  }
  next();
}

const promisify = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const h404 = (req, res, next) => {
  res.status(404).render("404", {
    title: "Page not found"
  });
};

const variable = (req, res, next) => {
  res.locals.isAuth = req.session.isAuthenticated;
  next();
};

const noAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    req.flash("msg", LOGGED_IN);
    return res.redirect("/");
  }
  next();
};

module.exports = {
  auth,
  promisify,
  h404,
  variable,
  noAuth
}

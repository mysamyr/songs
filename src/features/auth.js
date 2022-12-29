const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { auth, promisify, noAuth } = require("../middleware");
const { logger, errorLogger } = require("../services/logger");
const { validator, params, login, register } = require("../validators");
const { SENDGRID_EMAIL } = require("../config");
const {
  WRONG_EMAIL_OR_PASSWORD,
  EXISTING_USER,
  NOT_EXISTING_USER,
  PASSWORDS_NOT_MATCH,
  ALREADY_ACTIVATED,
} = require("../constants/error-messages");
const { SUCCESS } = require("../constants/messages");
const { User } = require("../models");
const { getLinkForVerification } = require("../helpers/user.helper");
const { sendAuthorisationEmail } = require("../services/mail");

// login
router.get(
  "/login",
  noAuth,
  promisify((req, res) =>
    res.render("auth", {
      title: "Увійти",
      isLogin: true,
      loginErr: req.flash("loginErr"),
      registerErr: req.flash("registerErr"),
      msg: req.flash("msg"),
    }),
  ),
);
router.post(
  "/login",
  validator.body(login.body),
  promisify(async (req, res) => {
    const { email, password } = req.body;
    const { session } = req;

    const candidate = await User.findOne({ email });
    if (!candidate) {
      logger.error(NOT_EXISTING_USER);
      req.flash("loginErr", NOT_EXISTING_USER);
      return res.redirect("/auth/login#login");
    }
    const isSame = await bcrypt.compare(password, candidate.password);
    if (!isSame) {
      logger.error(WRONG_EMAIL_OR_PASSWORD);
      req.flash("loginErr", WRONG_EMAIL_OR_PASSWORD);
      return res.redirect("/auth/login#login");
    }
    session.user = {
      id: candidate.id,
      email,
      name: candidate.name,
    };
    session.isAuthenticated = true;
    session.isValidated = candidate.verified;
    session.save((err) => {
      if (err) return errorLogger(err.message);
      return res.redirect("/");
    });
  }),
);

// logout
router.get(
  "/logout",
  auth,
  promisify(async (req, res) => req.session.destroy(() => res.redirect("/"))),
);

// register
router.post(
  "/register",
  noAuth,
  validator.body(register.body),
  promisify(async (req, res) => {
    const { name, email, password, confirm } = req.body;

    if (password !== confirm) {
      logger.error(PASSWORDS_NOT_MATCH);
      req.flash("registerErr", PASSWORDS_NOT_MATCH);
      return res.status(422).redirect("/auth/login#register");
    }
    const candidate = await User.findOne({ email });
    if (candidate) {
      logger.error(EXISTING_USER);
      req.flash("registerErr", EXISTING_USER);
      return res.status(422).redirect("/auth/login#register");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    // use timestamp as link for account verification
    const link = Date.now().toString();
    const user = await new User({
      email,
      name,
      password: hashPassword,
      link,
    });
    await user.save();
    await sendAuthorisationEmail({
      email,
      name,
      link: getLinkForVerification(link),
    });

    req.flash("msg", SUCCESS);
    return res.redirect("/auth/login#login");
  }),
);

// verification
router.get(
  "/verify/:id",
  validator.params(params),
  promisify(async (req, res) => {
    const { session } = req;

    if (session.isValidated) {
      logger.error(ALREADY_ACTIVATED);
      req.flash("err", ALREADY_ACTIVATED);
      return res.status(400).redirect("/");
    }
    const candidate = await User.findOne({ link: req.params.id });
    if (!candidate) {
      logger.error("Помилка активації");
      return res.render("verified", {
        title: "Помилка активації",
        email: SENDGRID_EMAIL,
      });
    }
    candidate.verified = true;
    await candidate.save();

    session.isValidated = true;
    session.save((err) => {
      if (err) return errorLogger(err.message);
      return res.render("verified", {
        title: "Вітання",
        name: candidate.name,
      });
    });
  }),
);

module.exports = router;

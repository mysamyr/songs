const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { auth, promisify } = require("../middleware");
const { errorLogger } = require("../services/logger");
const {changeEmail, changePassword, validate} = require("../validators");
const {
  SUCCESS_UPDATE_EMAIL,
  SUCCESS_UPDATE_PASSWORD, VERIFICATION_SENT,
} = require("../constants/messages");
const {
  EXISTING_EMAIL,
  WRONG_PASSWORD,
  PASSWORDS_MATCH,
  PASSWORDS_NOT_MATCH,
  VALIDATE_ACCOUNT, ALREADY_ACTIVATED, VERIFY_TRY_AGAIN,
} = require("../constants/error-messages");
const { User } = require("../models");
const { sendUpdateEmail, sendUpdatePassword, sendAuthorisationEmail} = require("../services/mail");
const { getLinkForVerification, getTimestampString } = require("../helpers/user.helper");
const {timeDiff } = require("../utils/time");

router.get(
  "/",
  auth,
  promisify(async (req, res) => {
    const { user, isValidated } = req.session;

    return res.render("cabinet", {
      title: "Кабінет",
      isCab: true,
      user,
      isValidated,
      err: req.flash("err"),
      msg: req.flash("msg"),
    });
  }),
);
router.post(
  "/email",
  auth,
  validate("body", changeEmail.body, "/cabinet"),
  promisify(async (req, res) => {
    const { session } = req;
    const { email } = req.body;

    if (!session.isValidated) {
      errorLogger(VALIDATE_ACCOUNT);
      req.flash("err", VALIDATE_ACCOUNT);
      return res.redirect("/cabinet");
    }
    const currentEmail = session.user.email;
    if (email === currentEmail) {
      errorLogger(EXISTING_EMAIL);
      req.flash("err", EXISTING_EMAIL);
      return res.redirect("/cabinet");
    }
    // link for DB and email verification
    const link = getTimestampString();

    await User.findByIdAndUpdate(session.user.id, {
      email,
      verified: false,
      link,
    });
    //  override session user with new email and cancel validation
    session.user.email = email;
    session.isValidated = false;

    await sendUpdateEmail({
      email,
      name: session.user.name,
      url: getLinkForVerification(link),
    });

    req.flash("msg", SUCCESS_UPDATE_EMAIL);
    return res.redirect("/cabinet");
  }),
);
router.post(
  "/password",
  auth,
  validate("body", changePassword.body, "/cabinet"),
  promisify(async (req, res) => {
    const {
      session: { user, isValidated },
      body: { password, newPassword, confirm }
    } = req;

    if (!isValidated) {
      errorLogger(VALIDATE_ACCOUNT);
      req.flash("err", VALIDATE_ACCOUNT);
      return res.redirect("/cabinet");
    }
    // todo move confirm check to client
    if (newPassword !== confirm) {
      errorLogger(PASSWORDS_NOT_MATCH);
      req.flash("err", PASSWORDS_NOT_MATCH);
      return res.redirect("/cabinet");
    }

    const candidate = await User.findById(user.id);

    const isValidPassword = await bcrypt.compare(password, candidate.password);
    if (!isValidPassword) {
      errorLogger(WRONG_PASSWORD);
      req.flash("err", WRONG_PASSWORD);
      return res.redirect("/cabinet");
    }

    const arePasswordsTheSame = await bcrypt.compare(
      newPassword,
      candidate.password,
    );
    if (arePasswordsTheSame) {
      errorLogger(PASSWORDS_MATCH);
      req.flash("err", PASSWORDS_MATCH);
      return res.redirect("/cabinet");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user.id, {
      password: hashPassword,
    });

    await sendUpdatePassword(user.email);

    req.flash("msg", SUCCESS_UPDATE_PASSWORD);
    return res.redirect("/cabinet");
  }),
);
router.get(
  "/resend",
  auth,
  promisify(async (req, res) => {
    const {user, isValidated} = req.session;

    if (isValidated) {
      errorLogger(ALREADY_ACTIVATED);
      req.flash("err", ALREADY_ACTIVATED);
      return res.redirect("/cabinet");
    }

    const currentTime = new Date();
    const DBUser = await User.findById(user.id);

    // if was sent inside 5 min
    if (timeDiff(currentTime, DBUser.verify_sent_at) < 300000) {
      errorLogger(VERIFY_TRY_AGAIN);
      req.flash("err", VERIFY_TRY_AGAIN);
      return res.redirect("/cabinet");
    }
    DBUser.verify_sent_at = currentTime;
    await DBUser.save();

    await sendAuthorisationEmail({
      email: user.email,
      name: user.name,
      url: getLinkForVerification(DBUser.link),
    });

    req.flash("msg", VERIFICATION_SENT);
    return res.redirect("/cabinet");
  }),
);

module.exports = router;

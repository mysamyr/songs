const router = require("express").Router();
const { auth, promisify } = require("../middleware");
const { logger } = require("../services/logger");
const {
  SUCCESS_UPDATE_EMAIL,
  SUCCESS_UPDATE_PASSWORD,
} = require("../constants/messages");
const {
  EXISTING_EMAIL,
  WRONG_PASSWORD,
  PASSWORDS_MATCH,
  PASSWORDS_NOT_MATCH,
  VALIDATE_ACCOUNT,
} = require("../constants/error-messages");
const { User } = require("../models");
const { getLinkForVerification } = require("../helpers/user.helper");
const { sendUpdateEmail, sendUpdatePassword } = require("../services/mail");
const bcrypt = require("bcryptjs");

router.get(
  "/",
  auth,
  promisify(async (req, res) => {
    const { user } = req.session;

    return res.render("cabinet", {
      title: "Кабінет",
      isCab: true,
      user,
      err: req.flash("err"),
      msg: req.flash("msg"),
    });
  }),
);
router.post(
  "/email",
  auth,
  promisify(async (req, res) => {
    const { session } = req;
    if (!session.isValidated) {
      logger.error(VALIDATE_ACCOUNT);
      req.flash("err", VALIDATE_ACCOUNT);
      return res.redirect("/cabinet");
    }

    const newEmail = req.body.email;
    const oldEmail = session.user.email;

    if (newEmail === oldEmail) {
      logger.error(EXISTING_EMAIL);
      req.flash("err", EXISTING_EMAIL);
      return res.redirect("/cabinet");
    }
    // link for DB and email verification
    const link = Date.now().toString();

    await User.findByIdAndUpdate(session.user.id, {
      email: req.body.email,
      verified: false,
      link,
    });
    //  override session user with new email and cancel validation
    session.user.email = newEmail;
    session.isValidated = false;

    await sendUpdateEmail({
      email: newEmail,
      name: session.user.name,
      link: getLinkForVerification(link),
    });

    req.flash("msg", SUCCESS_UPDATE_EMAIL);
    return res.redirect("/cabinet");
  }),
);
router.post(
  "/password",
  auth,
  promisify(async (req, res) => {
    const {
      session: { user, isValidated },
    } = req;
    if (!isValidated) {
      logger.error(VALIDATE_ACCOUNT);
      req.flash("err", VALIDATE_ACCOUNT);
      return res.redirect("/cabinet");
    }

    const { password, newPassword, confirmPassword } = req.body;
    const candidate = await User.findById(user.id);

    if (newPassword !== confirmPassword) {
      logger.error(PASSWORDS_NOT_MATCH);
      req.flash("err", PASSWORDS_NOT_MATCH);
      return res.redirect("/cabinet");
    }

    const isValidPassword = await bcrypt.compare(password, candidate.password);
    if (!isValidPassword) {
      logger.error(WRONG_PASSWORD);
      req.flash("err", WRONG_PASSWORD);
      return res.redirect("/cabinet");
    }

    const arePasswordsTheSame = await bcrypt.compare(
      newPassword,
      candidate.password,
    );
    if (arePasswordsTheSame) {
      logger.error(PASSWORDS_MATCH);
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

module.exports = router;

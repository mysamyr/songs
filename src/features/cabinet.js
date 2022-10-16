const router = require("express").Router();
const { auth, promisify } = require("../middleware");
const {
  SUCCESS_UPDATE_EMAIL,
  SUCCESS_UPDATE_PASSWORD,
} = require("../constants/messages");
const {
  EXISTING_EMAIL,
  WRONG_PASSWORD,
  PASSWORDS_MATCH,
  PASSWORDS_NOT_MATCH,
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

    res.render("cabinet", {
      title: "Кабінет",
      isCab: true,
      user,
      err: req.flash("err"),
      msg: req.flash("msg"),
    });
  }),
);
// перевірити чи email не повторюється, поміняти в базі email, скасувати верифікацію, відправити верифікаційний email
router.post(
  "/email",
  auth,
  promisify(async (req, res) => {
    const { session } = req;
    const newEmail = req.body.email;
    const oldEmail = session.user.email;
    // todo additional email validation
    if (newEmail === oldEmail) {
      // throw error if email is the same
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
    session.user = {
      ...session.user,
      email: newEmail,
    };
    session.isValidated = false;

    await sendUpdateEmail({
      email: newEmail,
      name: session.user.name,
      link: getLinkForVerification(link),
    });

    req.flash("msg", SUCCESS_UPDATE_EMAIL);
    res.redirect("/cabinet");
  }),
);
// перевірити пароль (і чи не той самий), поміняти в базі тільки пароль
router.post(
  "/password",
  auth,
  promisify(async (req, res) => {
    console.log(req.body);
    const {
      session: { user },
    } = req;
    const { password, newPassword, confirmPassword } = req.body;
    const candidate = await User.findById(user.id);
    // todo additional password validation
    if (confirmPassword !== confirmPassword) {
      req.flash("err", PASSWORDS_NOT_MATCH);
      return res.redirect("/cabinet");
    }
    const isValidPassword = await bcrypt.compare(password, candidate.password);
    if (!isValidPassword) {
      req.flash("err", WRONG_PASSWORD);
      return res.redirect("/cabinet");
    }
    const arePasswordsTheSame = await bcrypt.compare(
      newPassword,
      candidate.password,
    );
    if (arePasswordsTheSame) {
      req.flash("err", PASSWORDS_MATCH);
      return res.redirect("/cabinet");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user.id, {
      password: hashPassword,
    });

    await sendUpdatePassword(user.email);

    req.flash("msg", SUCCESS_UPDATE_PASSWORD);
    res.redirect("/cabinet");
  }),
);

module.exports = router;

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const {
  auth,
  promisify,
  noAuth
} = require("../middleware");
const {
  WRONG_EMAIL_OR_PASSWORD,
  EXISTING_USER,
  NOT_EXISTING_USER,
  PASSWORDS_NOT_MATCH,
} = require("../constants/error-messages");
const {SUCCESS} = require("../constants/messages");
const {User} = require("../models");
const {getLinkForVerification} = require("../helpers/user.helper");
const {sendAuthorisationEmail} = require("../services/mail");

// login
router.get("/login", noAuth, promisify((req, res) => {
  res.render("auth", {
    title: "Увійти",
    loginErr: req.flash("loginErr"),
    registerErr: req.flash("registerErr"),
    msg: req.flash("msg"),
    isLogin: true,
  });
}));
router.post("/login", promisify(async (req, res) => {
  const {email, password} = req.body;
  const {session} = req;

  const candidate = await User.findOne({email});
  if (candidate) {
    const isSame = await bcrypt.compare(password, candidate.password);
    if (isSame) {
      session.user = {
        id: candidate.id,
        email,
        name: candidate.name
      };
      session.isAuthenticated = true;
      session.isValidated = candidate.verified;
      session.save(err => {
        if (err) console.log(err);
        return res.redirect("/");
      });
    } else {
      req.flash("loginErr", WRONG_EMAIL_OR_PASSWORD);
      return res.redirect("/auth/login#login");
    }
  } else {
    req.flash("loginErr", NOT_EXISTING_USER);
    return res.redirect("/auth/login#login");
  }
}));

// logout
router.get("/logout", auth, promisify(async (req, res) => {
  req.session.destroy(() => res.redirect("/"));
}));

// register
router.post("/register", noAuth, promisify(async (req, res) => {
  const {name, email, password, confirm} = req.body;

  if (password !== confirm) {
    req.flash("registerErr", PASSWORDS_NOT_MATCH);
    return res.status(422).redirect("/auth/login#register");
  }
  const candidate = await User.findOne({email});
  if (candidate) {
    req.flash("registerErr", EXISTING_USER);
    res.status(422).redirect("/auth/login#register");
  } else {
    const hashPassword = await bcrypt.hash(password, 10);
    // use timestamp as link for account verification
    const link = Date.parse(new Date()).toString();
    const user = await new User({
      email,
      name,
      password: hashPassword,
      link
    });
    await user.save();
    await sendAuthorisationEmail({email, name, link: getLinkForVerification(link)});

    req.flash("msg", SUCCESS);
    res.redirect("/auth/login#login");
  }
}));

// verification
router.get("/verify/:id", promisify(async (req, res) => {
  const candidate = await User.findOne({link: req.params.id});
  if (candidate) {
    await User.findByIdAndUpdate(candidate._id, {
      verified: true,
      link: null
    });
    res.render("verified", {
      title: "Вітання",
      name: candidate.name
    });
  } else {
    res.render("index", {
      title: "Головна",
      isHome: true,
      msg: "Ви не змогли активувати обліковий запис.",
    });
  }
}));

module.exports = router;

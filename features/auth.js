const router = require("express").Router();
const bcrypt = require("bcryptjs");
const {
  auth,
  promisify,
  noAuth
} = require("../middleware");
const {
  WRONG_LOGIN_OR_PASSWORD,
  EXISTING_USER,
  NOT_EXISTING_USER,
  PASSWORDS_NOT_MATCH,
  SUCCESS
} = require("../constants");
const {User} = require("../models");

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
  const {login, password} = req.body;
  const {session} = req;

  const candidate = await User.findOne({login});
  if (candidate) {
    const isSame = await bcrypt.compare(password, candidate.password);
    if (isSame) {
      session.user = {
        id: candidate.id,
        login: candidate.login,
        name: candidate.name
      };
      session.isAuthenticated = true;
      session.save(err => {
        if (err) {
          console.log(err);
        }
        return res.redirect("/");
      });
    } else {
      req.flash("loginErr", WRONG_LOGIN_OR_PASSWORD);
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
  const {name, login, password, confirm} = req.body;

  if (password !== confirm) {
    req.flash("registerErr", PASSWORDS_NOT_MATCH);
    return res.status(422).redirect("/auth/login#register");
  }
  const candidate = await User.findOne({login});
  if (candidate) {
    req.flash("registerErr", EXISTING_USER);
    res.status(422).redirect("/auth/login#register");
  } else {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      login,
      name,
      password: hashPassword,
    });
    await user.save();

    req.flash("msg", SUCCESS);
    res.redirect("/auth/login#login");
  }
}));

module.exports = router;

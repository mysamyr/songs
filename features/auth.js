const {Router} = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const promisify = require("../middleware/promisify");
const User = require("../models/user");
const router = Router();

const noAuth = (req, res, next) => {
  if(req.session.isAuthenticated) {
    req.flash("msg", "Ви вже зареєстровані");
    return res.redirect("/");
  }
  next();
};

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
      session.user = candidate;
      session.isAuthenticated = true;
      session.save(err => {
        if (err) {
          console.log(err);
        }
        return res.redirect("/");
      });
    } else {
      req.flash("loginErr", "Неправильний логін чи пароль");
      return res.redirect("/auth/login#login");
    }
  } else {
    req.flash("loginErr", "Такого користувача не існує");
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
    req.flash("registerErr", "Паролі мають співпадати");
    return res.status(422).redirect("/auth/login#register");
  }
  const candidate = await User.findOne({login});
  if (candidate) {
    req.flash("registerErr", "Користувач вже існує");
    res.status(422).redirect("/auth/login#register");
  } else {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      login,
      name,
      password: hashPassword,
    });
    await user.save();

    req.flash("msg", "Ви успішно зареєструвалися");
    res.redirect("/auth/login#login");
  }
}));

module.exports = router;

const {Router} = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const promisify = require("../middleware/promisify");
const Users = require("../models/users");
const router = Router();

// login
router.get("/login", (req, res) => {
  res.render("auth", {
    title: "Увійти",
    loginErr: req.flash("loginErr"),
    registerErr: req.flash("registerErr"),
  });
});
router.post("/login", promisify(async (req, res) => {
  const {login, password} = req.body;
  const {session} = req;

  const candidate = await Users.findOne({login});
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
router.post("/register", promisify(async (req, res) => {
  const {name, login, password, confirm} = req.body;

  if (password !== confirm) {
    req.flash("registerErr", "Паролі мають співпадати");
    return res.status(422).redirect("/auth/login#register");
  }
  const candidate = await Users.findOne({login});
  if (candidate) {
    req.flash("registerErr", "Користувач вже існує");
    res.status(422).redirect("/auth/login#register");
  } else {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new Users({
      login,
      name,
      password: hashPassword,
    });
    await user.save();

    res.redirect("/auth/login#login");
  }
}));

module.exports = router;
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const promisify = require("../middleware/promisify");
const User = require("../models/user");
const router = Router();

router.get("/login", (req, res) => {
  res.render("auth", {
    title: "Увійти"
  });
});
router.post("/login", promisify(async (req, res) => {
  const { login, password } = req.body;
  const { session } = req;

  const candidate = await User.findOne({login});
  if (candidate) {
    const isSame = await bcrypt.compare(password, candidate.password);
    if (isSame) {
      session.user = candidate;
      session.isAuthenticated = true;
      session.save(err => {
        if (err) {
          throw err;
        }
        return res.redirect("/");
      })
    } else {
      // req.flash("loginErr", "Password is not correct");
      return res.redirect("/auth/login#login");
    }
  } else {
    // req.flash("loginErr", "Not existing user");
    return res.redirect("/auth/login#login");
  }
}));

router.get("/logout", promisify(async (req, res) => {
  const { session } = req;

  session.destroy(() => res.redirect("/"));
}));

router.post("/register", promisify(async (req, res) => {
  const {name, login, password} = req.body;

  // todo validation
  const candidate = await User.findOne({login});
  if (candidate) {
    throw new Error("Existing user");
  } else {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      login,
      name,
      password: hashPassword,
    });
    await user.save();

    res.redirect("/auth/login#login");
  }
}));

module.exports = router;

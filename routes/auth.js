const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/login", (req, res) => {
  res.render("auth", {
    title: "Увійти"
  });
});
router.post("/login", async (req, res) => {
  const candidate = await User.findOne({login: req.body.login});
  if (candidate) {
    req.session.user = candidate;
    req.session.isAuthenticated = true;
    req.session.save(e => {
      if (e) {
        throw e;
      }
    });
  }
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.post("/register", async (req, res) => {
  const user = await new User({
    login: req.body.login,
    password: req.body.password
  });
  user.save();
  res.redirect("/auth/login");
});

module.exports = router;
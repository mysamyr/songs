const router = require("express").Router();
const { promisify } = require("../middleware");
const { SENDGRID_EMAIL } = require("../config");

// Home page
router.get(
  "/",
  promisify(async (req, res) =>
    res.render("index", {
      title: "Головна",
      isHome: true,
      email: SENDGRID_EMAIL,
      msg: req.flash("msg"),
      err: req.flash("err"),
    }),
  ),
);

//Liturgy
router.get(
  "/lit",
  promisify(async (req, res) =>
    res.render("text", {
      title: "Літургія",
      isLit: true,
    }),
  ),
);

//Panachyda
router.get(
  "/pan",
  promisify(async (req, res) =>
    res.render("text", {
      title: "Панахида",
      isPan: true,
    }),
  ),
);

module.exports = router;

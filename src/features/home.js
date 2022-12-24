const router = require("express").Router();
const { promisify } = require("../middleware");

// Home page
router.get(
  "/",
  promisify(async (req, res) => {
    res.render("index", {
      title: "Головна",
      isHome: true,
      msg: req.flash("msg"),
    });
  }),
);

//Liturgy
router.get(
  "/lit",
  promisify(async (req, res) => {
    res.render("text", {
      title: "Літургія",
      isLit: true,
    });
  }),
);

//Panachyda
router.get(
  "/pan",
  promisify(async (req, res) => {
    res.render("text", {
      title: "Панахида",
      isPan: true,
    });
  }),
);

//Panachyda
router.get(
  "/test",
  promisify(async (req, res) => {
    res.render("test", {
      title: "Test",
    });
  }),
);

module.exports = router;

const router = require("express").Router();
const {promisify} = require("../middleware");

// Home page
router.get("/", promisify(async (req, res) => {
  res.render("index", {
    title: "Головна",
    isHome: true,
    msg: req.flash("msg"),
  });
}));

//Liturgy
router.get("/lit", promisify(async (req, res) => {
  res.render("text", {
    title: "Літургія",
    text: "lit",
    isLit: true,
  });
}));

//Panachyda
router.get("/pan", promisify(async (req, res) => {
  res.render("text", {
    title: "Панахида",
    text: "pan",
    isPan: true,
  });
}));

module.exports = router;

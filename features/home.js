const {Router} = require("express");
const promisify = require("../middleware/promisify");
const Text = require("../models/text");
const router = Router();

// Home page
router.get("/", promisify(async (req, res) => {
  res.render("index", {
    title: "Головна",
    isHome: true,
  });
}));

//Liturgy
router.get("/lit", promisify(async (req, res) => {
  const lit = await Text.findOne({name: "Літургія"});

  res.render("text", {
    title: "Літургія",
    text: lit.text,
    isLit: true,
  });
}));

//Liturgy
router.get("/pan", promisify(async (req, res) => {
  const pan = await Text.findOne({name: "Панахида"});

  res.render("text", {
    title: "Панахида",
    text: pan.text,
    isPan: true,
  });
}));

module.exports = router;

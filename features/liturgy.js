const {Router} = require("express");
const promisify = require("../middleware/promisify");
const Liturgy = require("../models/liturgy");
const router = Router();

router.get("/", promisify(async (req, res) => {
  const lit = await Liturgy.findOne({name: "Літургія"});

  res.render("liturgy", {
    title: "Літургія",
    text: lit.text
  });
}));

module.exports = router;

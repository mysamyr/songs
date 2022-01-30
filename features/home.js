const {Router} = require("express");
const promisify = require("../middleware/promisify");
const router = Router();


// Home page
router.get("/", promisify(async (req, res) => {
  res.render("index", {
    title: "Головна",
  });
}));

module.exports = router;

const {Router} = require("express");
const Categories = require("../models/categories");
const Songs = require("../models/songs");
const router = Router();

router.get("/", async (req, res) => {
  const categories = await Categories.find();

  res.render("index", {
    title: "Збірник пісень",
    categories: categories.map(i => i.toObject())
  });
});

router.get("/favicon.ico", (req, res) => {
  res.sendStatus(201);
});

router.get("/:category", async (req, res) => {
  const songs = await Songs.find({category: req.params.category}).select("name id");
  const category = await Categories.findOne({short: req.params.category}).select("name");

  await res.render("category", {
    title: `${req.params.category} пісні`,
    category: category.name,
    songs: songs.map(i => i.toObject())
  })
});

router.post("/:category", async (req, res) => {
  // todo create new category
});

module.exports = router;
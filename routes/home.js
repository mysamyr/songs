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
    title: category.name,
    category: category.name,
    songs: songs.map(i => i.toObject()).sort((x, y) => {
      if (x.name < y.name) {
        return -1;
      }
      if (x.name > y.name) {
        return 1;
      }
      return 0;
    }),
  });
});

router.post("/:category", async (req, res) => {
  // todo create new category
});

module.exports = router;
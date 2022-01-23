const {Router} = require("express");
const Categories = require("../models/categories");
const Songs = require("../models/songs");
const router = Router();
const SHORTS = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];

router.get("/", async (req, res) => {
  const categories = await Categories.find();

  res.render("index", {
    title: "Збірник пісень",
    categories: categories.map(i => i.toObject())
  });
});

router.get("/category/new", async (req, res) => {
  const categories = await Categories.find();

  const shorts = SHORTS.reduce((acc, c) => {
    if (!categories.find(i => i.short === c)) {
      acc.push({
        name: c
      });
    }
    return acc;
  }, []);

  res.render("new_category", {
    title: "Додати нову категорію",
    shorts,
  });
});

router.post("/category/new", async (req, res) => {
  if (!req.body.short) {
    res.redirect("/");
  }
  try {
    const newCategory = await new Categories({
      name: req.body.name,
      short: req.body.short,
    });
    await newCategory.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.get("/category/delete/:short", async (req, res) => {
  if (!req.params.short) {
    return res.redirect("/");
  }
  try {
    const categorySongs = await Songs.find({
      category: req.params.short,
    });
    if (categorySongs.length) {
      return res.redirect(`/category/${req.params.short}`);
    }
    const category = await Categories.findOne({short: req.params.short});
    await category.deleteOne();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.get("/category/:category", async (req, res) => {
  const songs = await Songs.find({category: req.params.category}).select("name id");
  const category = await Categories.findOne({short: req.params.category});

  await res.render("category", {
    title: category.name,
    categoryName: category.name,
    categoryShort: category.short,
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

module.exports = router;
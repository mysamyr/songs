const {Router} = require("express");
const Categories = require("../models/categories");
const Songs = require("../models/songs");
const router = Router();
const {SHORTS} = require("../constants");

// Home page
router.get("/", async (req, res) => {
  try {
    const categories = await Categories.find();

    res.render("index", {
      title: "Збірник пісень",
      categories: categories.map(i => i.toObject()),
      isHome: true,
    });
  } catch (e) {
    console.log(e);
  }
});

// Add new category
router.get("/category/new", (req, res) => {
  res.render("new_category", {
    title: "Додати нову категорію",
  });
});
router.post("/category/new", async (req, res) => {
  try {
    const categories = await Categories.find().select("short");
    const shorts = categories.map(c => c.short);
    const short = SHORTS.find(i => !shorts.includes(i));
    const newCategory = await new Categories({
      name: req.body.name,
      short,
    });
    await newCategory.save();

    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

// Delete category
router.get("/category/delete/:short", async (req, res) => {
  try {
    const categorySongs = await Songs.find({
      categories: [req.params.short],
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

// Show songs from category
router.get("/category/:category", async (req, res) => {
  try {
    const songs = await Songs.find({categories: req.params.category}).select("name id");
    const category = await Categories.findOne({short: req.params.category});

    if (!category) {
      res.redirect("/");
      throw new Error("No such category");
    }

    res.render("category", {
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
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

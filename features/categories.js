const {Router} = require("express");
const auth = require("../middleware/auth");
const promisify = require("../middleware/promisify");
const {SHORTS} = require("../constants");
const Categories = require("../models/categories");
const Songs = require("../models/songs");
const router = Router();

const generateUniqueShort = (categories) => {
  const shorts = categories.map(c => c.short);
  return SHORTS.find(i => !shorts.includes(i));
}

// Home page
router.get("/", promisify(async (req, res) => {
  const categories = await Categories.find();

  res.render("index", {
    title: "Збірник пісень",
    categories: categories.map(i => i.toObject()),
    isHome: true,
    msg: req.flash("msg"),
  });
}));

// Add new category
router.get("/category/new", auth, promisify((req, res) => {
  res.render("new_category", {
    title: "Додати нову категорію",
    err: req.flash("err"),
  });
}));
router.post("/category/new", promisify(async (req, res) => {
  const {name} = req.body;

  const categories = await Categories.find();
  if (categories.find(c => c.name === name)) {
    req.flash("err", "Категорія вже існує");
    return res.redirect("/category/new");
  }

  const short = generateUniqueShort(categories);

  const newCategory = await new Categories({
    name,
    short,
    created_by: req.session.user.name,
  });
  await newCategory.save();

  req.flash("msg", `Категорія ${name} успішно створена`);
  res.redirect("/");
}));

// Delete category
router.get("/category/delete/:short", auth, promisify(async (req, res) => {
  const {short} = req.params;

  const categorySongs = await Songs.find({
    categories: short,
  });

  if (!categorySongs.length) {
    const category = await Categories.findOneAndDelete({short});
    await category.deleteOne();

    req.flash("msg", `Категорія ${category.name} видалена`);
    res.redirect("/");
  } else {
    req.flash("err", "В категорії ще є пісні");
    res.redirect(`/category/${short}`);
  }
}));

// Show songs from category
router.get("/category/:category", promisify(async (req, res, next) => {
  const {category} = req.params;

  const songs = await Songs.find({categories: category}).select("name id");
  const dbCategories = await Categories.findOne({short: category});

  if (!dbCategories) {
    return next();
  }

  res.render("category", {
    title: dbCategories.name,
    categoryName: dbCategories.name,
    categoryShort: dbCategories.short,
    songs: songs.map(i => i.toObject()).sort((x, y) => {
      if (x.name < y.name) {
        return -1;
      }
      if (x.name > y.name) {
        return 1;
      }
      return 0;
    }),
    err: req.flash("err"),
  });
}));

module.exports = router;

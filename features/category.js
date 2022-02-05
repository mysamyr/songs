const {Router} = require("express");
const auth = require("../middleware/auth");
const promisify = require("../middleware/promisify");
const Category = require("../models/category");
const Song = require("../models/song");
const router = Router();

// Categories
router.get("/", promisify(async (req, res) => {
  const categories = await Category.find();

  res.render("categories", {
    title: "Збірник пісень",
    categories: categories.map(i => i.toObject()),
    isSong: true,
    msg: req.flash("msg"),
  });
}));

// Add new category
router.get("/add", auth, promisify((req, res) => {
  res.render("new_category", {
    title: "Додати нову категорію",
    isSong: true,
    err: req.flash("err"),
  });
}));
router.post("/add", promisify(async (req, res) => {
  const {name} = req.body;
  const {user} = req.session;

  const categories = await Category.find();
  if (categories.find(c => c.name === name)) {
    req.flash("err", "Категорія вже існує");
    return res.redirect("/category/add");
  }

  console.log(user);

  const newCategory = await new Category({
    name,
    created_by: user._id,
  });
  await newCategory.save();

  req.flash("msg", `Категорія ${name} успішно створена`);
  res.redirect("/category");
}));

// Delete category
router.get("/delete/:id", auth, promisify(async (req, res) => {
  const {id} = req.params;

  const categorySongs = await Song.find({
    categories: id,
  });

  if (!categorySongs.length) {
    const category = await Category.findOneAndDelete({_id: id});
    await category.deleteOne();

    req.flash("msg", `Категорія ${category.name} видалена`);
    res.redirect("/category");
  } else {
    req.flash("err", "В категорії ще є пісні");
    res.redirect(`/category/${id}`);
  }
}));

// Show songs from category
router.get("/:id", promisify(async (req, res, next) => {
  const {id} = req.params;

  const songs = await Song.find({categories: id}).select("name id");
  const dbCategories = await Category.findOne({_id: id});

  if (!dbCategories) {
    return next();
  }

  res.render("category", {
    title: dbCategories.name,
    categoryName: dbCategories.name,
    categoryId: dbCategories._id,
    songs: songs.map(i => i.toObject()).sort((x, y) => {
      if (x.name < y.name) {
        return -1;
      }
      if (x.name > y.name) {
        return 1;
      }
      return 0;
    }),
    isSong: true,
    err: req.flash("err"),
  });
}));

module.exports = router;

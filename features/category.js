const router = require("express").Router();
const {
  auth,
  promisify
} = require("../middleware");
const {
  EXISTING_CATEGORY,
  SUCCESS_CREATE_CATEGORY,
  SUCCESS_DELETE_CATEGORY,
  SONGS_INSIDE_CATEGORY
} = require("../constants");
const {
  Category,
  Song
} = require("../models");

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
    req.flash("err", EXISTING_CATEGORY);
    return res.redirect("/category/add");
  }

  const newCategory = await new Category({
    name,
    created_by: user.id,
  });
  await newCategory.save();

  req.flash("msg", SUCCESS_CREATE_CATEGORY(name));
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

    req.flash("msg", SUCCESS_DELETE_CATEGORY(category.name));
    res.redirect("/category");
  } else {
    req.flash("err", SONGS_INSIDE_CATEGORY);
    res.redirect(`/category/${id}`);
  }
}));

// Show songs in category
router.get("/:id", promisify(async (req, res, next) => {
  const {id} = req.params;

  const songs = await Song.find({categories: id}).select("name id");
  const dbCategories = await Category.findOne({_id: id});

  if (!dbCategories) {
    return next();
  }

  res.render("category", {
    title: dbCategories.name,
    isSong: true,
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
    err: req.flash("err"),
  });
}));

module.exports = router;

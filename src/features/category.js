const router = require("express").Router();
const { auth, promisify, isValid } = require("../middleware");
const { logger } = require("../services/logger");
const {validator, params, category} = require("../validators");
const {
  EXISTING_CATEGORY,
  SONGS_INSIDE_CATEGORY,
  NO_SUCH_CATEGORY,
} = require("../constants/error-messages");
const {
  SUCCESS_CREATE_CATEGORY,
  SUCCESS_DELETE_CATEGORY,
} = require("../constants/messages");
const { Category, Song } = require("../models");
const { sortSongs } = require("../helpers/category.helper");

// Categories
router.get(
  "/",
  promisify(async (req, res) => {
    const categories = await Category.find();

    return res.render("categories", {
      title: "Збірник пісень",
      categories: categories.map((i) => i.toObject()),
      isSong: true,
      msg: req.flash("msg"),
      err: req.flash("err"),
    });
  }),
);

// Add new category
router.get(
  "/add",
  auth,
  isValid,
  promisify((req, res) =>
    res.render("new_category", {
      title: "Додати нову категорію",
      isSong: true,
      err: req.flash("err"),
    }),
  ),
);
router.post(
  "/add",
  validator.body(category.body),
  promisify(async (req, res) => {
    const { name } = req.body;
    const { user } = req.session;
    const formattedName = name.trim().toLowerCase();

    const isCategoryExists = await Category.findOne({
      name: formattedName,
    });
    if (isCategoryExists) {
      logger.error(EXISTING_CATEGORY);
      req.flash("err", EXISTING_CATEGORY);
      return res.redirect("/category/add");
    }

    const newCategory = await new Category({
      name: formattedName,
      created_by: user.id,
    });
    await newCategory.save();

    req.flash("msg", SUCCESS_CREATE_CATEGORY(formattedName));
    return res.redirect("/category");
  }),
);

// Delete category
router.get(
  "/delete/:id",
  auth,
  isValid,
  validator.params(params),
  promisify(async (req, res) => {
    const { id } = req.params;

    const areSongsInsideCategory = await Song.find({
      categories: id,
      deleted: false,
    });

    if (areSongsInsideCategory.length) {
      logger.error(SONGS_INSIDE_CATEGORY);
      req.flash("err", SONGS_INSIDE_CATEGORY);
      return res.redirect(`/category/${id}`);
    }
    const category = await Category.findOneAndDelete({ _id: id });

    req.flash("msg", SUCCESS_DELETE_CATEGORY(category.name));
    return res.redirect("/category");
  }),
);

// Show songs in category
router.get(
  "/:id",
  validator.params(params),
  promisify(async (req, res) => {
    const { id } = req.params;

    const songs = await Song.find({ categories: id, deleted: false }).select(
      "name id",
    );
    const dbCategory = await Category.findOne({ _id: id });

    if (!dbCategory) {
      logger.error(NO_SUCH_CATEGORY);
      req.flash("err", NO_SUCH_CATEGORY);
      return res.redirect("/category");
    }

    return res.render("category", {
      title: dbCategory.name,
      isSong: true,
      categoryName: dbCategory.name,
      categoryId: dbCategory._id,
      songs: sortSongs(songs),
      err: req.flash("err"),
    });
  }),
);

module.exports = router;

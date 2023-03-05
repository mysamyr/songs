const router = require("express").Router();
const {auth, promisify, isValid} = require("../middleware");
const {errorLogger} = require("../services/logger");
const {validateAddSong, validateParamsId, validateEditSong} = require("../validators");
const {LOGIN_PLEASE, NO_CATEGORIES, EXISTING_SONG} = require("../constants/error-messages");
const {
  DELETED_CATEGORY,
  SUCCESS_DELETE_SONG,
  CREATE_SONG, EDIT_SONG,
} = require("../constants/messages");
const {Song, Category, User} = require("../models");
const {separateCategories} = require("../helpers/songs.helper");

// Add new song
router.get(
  "/add",
  auth,
  isValid,
  promisify(async (req, res) => {
    const {current, name, text} = req.query;

    const categories = await Category.find();
    if (!categories?.length) {
      req.flash("msg", NO_CATEGORIES);
      return res.redirect("/category");
    }

    return res.render("new_song", {
      title: "Додати пісню",
      isSong: true,
      current,
      name,
      text,
      categories: categories.map((i) => i.toObject()),
      err: req.flash("err"),
    });
  }),
);
router.post(
  "/add",
  validateAddSong,
  promisify(async (req, res) => {
    const {
      body: {categories, name, text},
      session: {user: {email}}
    } = req;

    const catArray = Array.isArray(categories) ? categories : [categories];

    const dbCat = await Category.find({name: catArray});

    if (!dbCat.length || catArray.length !== dbCat.length) {
      errorLogger(DELETED_CATEGORY);
      req.flash("err", DELETED_CATEGORY);
      return res.redirect("/song/add");
    }

    const isSongExist = await Song.findOne({name, deleted: false});
    if (isSongExist) {
      errorLogger(EXISTING_SONG);
      req.flash("err", EXISTING_SONG);
      return res.redirect("/song/add");
    }

    const user = await User.findOne({email});
    const newSong = await Song.create({
      name,
      text,
      author: user.id,
      categories: dbCat.map((i) => i._id),
    });

    req.flash("msg", CREATE_SONG);
    return res.redirect(`/song/${newSong._id}`);
  }),
);

// Edit existing song
router.get(
  "/edit/:id",
  auth,
  isValid,
  validateParamsId("/category"),
  promisify(async (req, res) => {
    const {id} = req.params;

    const song = await Song.findOne({_id: id});
    const allCategories = await Category.find();

    const {currents, categories} = separateCategories(allCategories, song);

    return res.render("edit_song", {
      title: "Редагувати пісню",
      isSong: true,
      id,
      name: song.name,
      text: song.text,
      currents,
      categories,
      err: req.flash("err"),
    });
  }),
);
router.post(
  "/edit/:id",
  validateEditSong,
  promisify(async (req, res) => {
    const {categories, name, text} = req.body;
    const {id} = req.params;
    const {user} = req.session;

    const dbCategories = await Category.find({name: categories});
    const dbUser = await User.findOne({id: user?.id});

    if (!dbUser) {
      errorLogger(LOGIN_PLEASE);
      req.flash("err", LOGIN_PLEASE);
      return res.redirect(`/song/edit/${req.params.id}`);
    }

    await Song.findOneAndUpdate(
      {_id: id},
      {
        name: name,
        text: text,
        author: dbUser.id,
        categories: dbCategories.map((c) => c._id),
      },
    );

    req.flash("msg", EDIT_SONG);
    return res.redirect(`/song/${req.params.id}`);
  }),
);

// Delete song
router.get(
  "/delete/:id",
  auth,
  isValid,
  validateParamsId("/category"),
  promisify(async (req, res) => {
    const {id} = req.params;

    const song = await Song.findOneAndUpdate(
      {_id: id},
      {
        deleted: true,
        deleted_at: new Date(),
      },
    );

    req.flash("msg", SUCCESS_DELETE_SONG(song.name));
    return res.redirect("/category");
  }),
);

// Get song
router.get(
  "/:id",
  validateParamsId("/category"),
  promisify(async (req, res) => {
    const {id} = req.params;
    const {user} = req.session;

    const song = await Song.findOne({_id: id});
    const dbSongUser = await User.findOne({_id: song.author});
    const isAuthor = user?.id === dbSongUser.id;

    return res.render("song", {
      title: song.name,
      isSong: true,
      name: song.name,
      author: dbSongUser.name,
      text: song.text,
      id: song.id,
      msg: req.flash("msg"),
      isAuthor,
    });
  }),
);

module.exports = router;

const {Router} = require("express");
const auth = require("../middleware/auth");
const promisify = require("../middleware/promisify");
const Song = require("../models/song");
const Category = require("../models/category");
const User = require("../models/user");
const router = Router();

// Add new song
router.get("/add", auth, promisify(async (req, res) => {
  const categories = await Category.find();

  res.render("new_song", {
    title: "Додати пісню",
    categories: categories.map(i => i.toObject()),
    isSong: true,
    err: req.flash("err")
  });
}));
router.post("/add", promisify(async (req, res) => {
  const {categories, name, text} = req.body;
  const {login} = req.session.user;

  const dbCategories = await Category.find({name: categories}).select("short");

  if (
    Array.isArray(categories) && categories.length !== dbCategories.length
    || !dbCategories.length
  ) {
    req.flash("err", "Категорія була видалена. Виберіть нову");
    res.redirect("/song/add");
  }

  const user = await User.findOne({login});
  const song = await new Song({
    name,
    text,
    author: user._id,
    categories: dbCategories.map(i => i._id),
  });
  await song.save();

  res.redirect(`/song/${song._id}`);
}));

// Edit existing song
router.get("/edit/:id", auth, promisify(async (req, res) => {
  const {id} = req.params;

  const song = await Song.findOne({_id: id});
  const allCategories = await Category.find();

  const {currents, categories} = allCategories.reduce((acc, c) => {
    if (song.categories.includes(c._id)) {
      acc.currents.push({name: c.name});
    } else {
      acc.categories.push({name: c.name})
    }
    return acc;
  }, {
    currents: [],
    categories: []
  });

  res.render("edit_song", {
    title: "Редагувати пісню",
    id,
    name: song.name,
    text: song.text,
    currents,
    categories,
    isSong: true,
  });
}));
router.post("/edit/:id", promisify(async (req, res) => {
  const {name, text, categories} = req.body;
  const {id} = req.params;
  const {user} = req.session;

  const dbCategories = await Category.find({name: categories});
  const dbUser = await User.findOne({_id: user?._id});

  if (!dbUser) {
    req.flash("err", "Зареєструйтеся, будь ласка");
    res.redirect(`/song/edit/${req.params.id}`);
  }

  await Song.findOneAndUpdate({_id: id}, {
    name: name,
    text: text,
    author: dbUser.id,
    categories: dbCategories.map(c => c._id),
  });

  res.redirect(`/song/${req.params.id}`);
}));

// Delete song
router.post("/delete/:id", auth, promisify(async (req, res) => {
  const {id} = req.params;

  const song = await Song.findOneAndDelete({_id: id});

  req.flash("msg", `Пісня ${song.name} успішно видалена`);
  res.redirect("/category");
}));

// Get song
router.get("/:id", promisify(async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;

  const song = await Song.findOne({_id: id});
  const dbSongUser = await User.findOne({_id: song.author});
  const dbSessionUser = await User.findOne({_id: user?._id});
  const isAuthor = dbSessionUser?.id === song.author;

  res.render("song", {
    title: song.name,
    name: song.name,
    author: dbSongUser.name,
    text: song.text,
    id: song.id,
    isAuthor,
    isSong: true,
  });
}));

module.exports = router;

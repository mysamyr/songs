const {Router} = require("express");
const auth = require("../middleware/auth");
const promisify = require("../middleware/promisify");
const Songs = require("../models/songs");
const Categories = require("../models/categories");
const User = require("../models/user");
const router = Router();

// Add new song
router.get("/new", auth, promisify(async (req, res) => {
  const categories = await Categories.find();

  res.render("new", {
    title: "Додати пісню",
    categories: categories.map(i => i.toObject()),
  });
}));
router.post("/new", promisify(async (req, res) => {
  const { categories, name, text } = req.body;
  const { login } = req.session.user;

  const cat = await Categories.find({name: categories}).select("short");
  const user = await User.findOne({login}).select("name");
  const song = await new Songs({
    name,
    text,
    author: user.name,
    categories: cat.map(i => i.short),
  });
  await song.save();

  res.redirect(`/song/${song._id}`);
}));

// Edit existing song
router.get("/edit/:id", auth, promisify(async (req, res) => {
  const { id } = req.params;

  const song = await Songs.findOne({_id: id});
  const allCategories = await Categories.find();

  const {currents, categories} = allCategories.reduce((acc, c) => {
    if (song.categories.includes(c.short)) {
      acc.currents.push({name: c.name});
    } else {
      acc.categories.push({name: c.name})
    }
    return acc;
  }, {
    currents: [],
    categories: []
  });

  res.render("edit", {
    title: "Редагувати пісню",
    id: req.params.id,
    name: song.name,
    text: song.text,
    currents,
    categories,
  });
}));
router.post("/edit/:id", promisify(async (req, res) => {
  const {name, text, categories} = req.body;
  const {id} = req.params;
  try {
    const ctgs = await Categories.find({name: categories}).select("short");
    const user = await User.findOne({login: req.session.user.login}).select("name");
    await Songs.findOneAndUpdate({_id: id}, {
      name: name,
      text: text,
      author: user.name,
      categories: ctgs.map(c => c.short),
    });

    res.redirect(`/song/${req.params.id}`)
  } catch (e) {
    console.log(e);
  }
}));

// Delete song
router.post("/delete/:id", auth, promisify(async (req, res) => {
  try {
    const song = await Songs.findOne({_id: req.params.id});
    await song.deleteOne();

    req.flash("msg", `Пісня ${song.name} успішно видалена`);
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
}));

// Get song
router.get("/:id", promisify(async (req, res) => {
  const {id} = req.params;
  try {
    const song = await Songs.findOne({_id: id});
    const user = await User.findOne({login: req.session.user?.login});
    const isAuthor = user?.name === song.author;

    res.render("song", {
      title: song.name,
      name: song.name,
      author: song.author,
      text: song.text,
      id: song.id,
      isAuthor
    });
  } catch (e) {
    console.log(e);
  }
}));

module.exports = router;

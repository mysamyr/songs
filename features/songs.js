const {Router} = require("express");
const Songs = require("../models/songs");
const Categories = require("../models/categories");
const promisify = require("../middleware/promisify");
const router = Router();

// Add new song
router.get("/new", promisify(async (req, res) => {
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
  const song = await new Songs({
    name,
    text,
    author: login,
    categories: cat.map(i => i.short),
  });
  await song.save();

  res.redirect("/");
}));

// Edit existing song
router.get("/edit/:id", promisify(async (req, res) => {
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
  try {
    const categories = await Categories.find({name: req.body.categories}).select("short");
    await Songs.findOneAndUpdate({_id: req.params.id}, {
      name: req.body.name,
      text: req.body.text,
      author: req.session.user.login,
      categories: categories.map(c => c.short),
    });

    res.redirect(`/song/${req.params.id}`)
  } catch (e) {
    console.log(e);
  }
}));

// Delete song
router.post("/delete/:id", promisify(async (req, res) => {
  try {
    const song = await Songs.findOne({_id: req.params.id});
    await song.deleteOne();

    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
}));

// Get song
router.get("/:id", promisify(async (req, res) => {
  try {
    const song = await Songs.findOne({_id: req.params.id});
    const isAuthor = req.session.user?.login === song.author;

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

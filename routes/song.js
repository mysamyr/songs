const {Router} = require("express");
const Songs = require("../models/songs");
const Categories = require("../models/categories");
const router = Router();

// Add new song
router.get("/new", async (req, res) => {
  try {
    const categories = await Categories.find();

    res.render("new", {
      title: "Додати пісню",
      categories: categories.map(i => i.toObject()),
    });
  } catch (e) {
    console.log(e);
  }
});
router.post("/new", async (req, res) => {
  try {
    const categories = await Categories.find({name: req.body.categories}).select("short");
    const song = await new Songs({
      name: req.body.name,
      text: req.body.text,
      author: req.session.user.login,
      categories: categories.map(i => i.short),
    });
    await song.save();

    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

// Edit existing song
router.get("/edit/:id", async (req, res) => {
  try {
    const song = await Songs.findOne({_id: req.params.id});
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
  } catch (e) {
    console.log(e);
  }
});
router.post("/edit/:id", async (req, res) => {
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
});

// Delete song
router.post("/delete/:id", async (req, res) => {
  try {
    const song = await Songs.findOne({_id: req.params.id});
    await song.deleteOne();

    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

// Get song
router.get("/:id", async (req, res) => {
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
});

module.exports = router;

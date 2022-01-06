const {Router} = require('express');
const Songs = require("../models/songs");
const Categories = require("../models/categories");
const router = Router();

router.get('/add', async (req, res) => {
  try {
    const categories = await Categories.find();
    res.render('add', {
      title: 'Додати пісню',
      categories: categories.map(i => i.toObject())
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/add', async (req, res) => {
  try {
    if (!req.body.category) {
      const categories = await Categories.find();
      res.render('add', {
        title: 'Додати пісню',
        name: req.body.name,
        text: req.body.text,
        author: req.body.author,
        categories: categories.map(i => i.toObject())
      });
    } else {
      const category = await Categories.findOne({name: [req.body.category]}).select("short");
      const song = await new Songs({
        name: req.body.name,
        text: req.body.text,
        author: req.body.author,
        category: category.short
      });
      await song.save();
      res.redirect('/');
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/edit/:id", async (req, res) => {
  const song = await Songs.findOne({_id: req.params.id});
  const categories = await Categories.find();
  const current = categories.find(c => c.short === song.category);
  res.render("edit", {
    title: "Редагування",
    name: song.name,
    author: song.author,
    text: song.text,
    id: song.id,
    current: current.name,
    categories: categories.map(i => i.toObject())
  });
});

router.post("/edit/:id", async (req, res) => {
  try {
    const category = await Categories.findOne({name: req.body.category}).select("short");
    await Songs.findOneAndUpdate({_id: req.params.id}, {
      name: req.body.name,
      text: req.body.text,
      author: req.body.author,
      category: category.short,
    });
    res.redirect(`/song/${req.params.id}`)
  } catch (e) {
    console.log(e);
  }
});

router.post("/delete/:id", async (req, res) => {
  const song = await Songs.findOne({_id: req.params.id});
  song.deleteOne();
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  try {
    const song = await Songs.findOne({_id: req.params.id});
    res.render('song', {
      title: song.name,
      name: song.name,
      author: song.author,
      text: song.text,
      id: song.id
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
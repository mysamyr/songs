const {Router} = require('express');
const Songs = require("../models/songs");
const router = Router();

router.get("/:id", async (req, res) => {
  const song = await Songs.findOne({_id: req.params.id});
  res.render('song', {
    title: song.name,
    name: song.name,
    author: song.author,
    text: song.text,
    id: song.id
  });
});

router.post("/:id", async (req, res) => {
  const song = await Songs.findOne({_id: req.params.id});
  song.deleteOne();
  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
  const song = await Songs.findOne({_id: req.params.id});
  res.render("edit", {
    title: "Редагування",
    name: song.name,
    author: song.author,
    text: song.text,
    id: song.id
  });
});

router.post("/edit/:id", async (req, res) => {
  try {
    await Songs.findOneAndUpdate({_id: req.params.id}, {
      name: req.body.name,
      text: req.body.text,
      author: req.body.author,
    });
    res.redirect(`/song/${req.params.id}`)
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
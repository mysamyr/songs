const {Router} = require('express');
const Songs = require("../models/songs");
const router = Router();

router.get("/:id", async (req, res) => {
  const song = await Songs.findOne({_id: req.params.id});
  res.render('song', {
    title: 'Home page',
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

module.exports = router;
const {Router} = require('express');
const Songs = require("../models/songs");
const router = Router();
const {
  CATEGORIES
} = require("../constants");

router.get('/:category', async (req, res) => {
  const songs = await Songs.find({category: req.params.category}).select("name id");
  const category = CATEGORIES[req.params.category];
  res.render('category', {
    title: `${req.params.category} пісні`,
    category,
    songs: songs.map(i => i.toObject())
  })
});

module.exports = router;
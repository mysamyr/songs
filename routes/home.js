const {Router} = require('express');
const Songs = require("../models/songs");
const router = Router();

router.get('/', async (req, res) => {
  const songs = await Songs.find().select("name id");
  console.log(songs);
  res.render('index', {
    title: 'Home page',
    songs: songs.map(i => i.toObject())
  })
});

module.exports = router;
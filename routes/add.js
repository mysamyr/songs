const {Router} = require('express');
const Songs = require("../models/songs");
const router = Router();
const {
  CATEGORIES,
  INVERT_CATEGORIES
} = require("../constants");

router.get('/', (req, res) => {
  try {
    const categories = Object.values(CATEGORIES).map(c=> ({value: c}));
    res.render('add', {
      title: 'Додати пісню',
      categories
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/', async (req, res) => {
  const category = INVERT_CATEGORIES[req.body.category];
  const song = await new Songs({
    name: req.body.name,
    text: req.body.text,
    author: req.body.author,
    category
  });

  try {
    await song.save();
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
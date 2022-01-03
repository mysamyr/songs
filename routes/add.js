const {Router} = require('express');
const Songs = require("../models/songs");
const router = Router();

router.get('/', (req, res) => {
  try {
    res.render('add', {
      title: 'Додати пісню',
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const song = await new Songs({
    name: req.body.name,
    text: req.body.text,
    author: req.body.author,
  });

  try {
    await song.save();
    res.redirect('/')
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
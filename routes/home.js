const {Router} = require('express');
const Songs = require("../models/songs");
const router = Router();
const {
  CATEGORIES
} = require("../constants");

router.get('/', async (req, res) => {
  const categories = await Songs.find().select("category");

  res.render('index', {
    title: "Збірник пісень",
    categories: categories.map(i => {
      i.toObject();
      return {category: i.category, cat: CATEGORIES[i.category]};
    })
  });
});

module.exports = router;
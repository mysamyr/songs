const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const expHbs = require('express-handlebars');
const homeRoute = require("./routes/home");
const songRoute = require("./routes/song");
const addRoute = require("./routes/add");

const PORT = 3000;
const MONGODB_URL = "mongodb+srv://liubomyr:xSLhUE6uFaJsNUaW@cluster.xytnl.mongodb.net/songs";
const app = express();
const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  allowProtoMethodsByDefault: true,
});

app.engine('hbs', hbs.engine);
app.set('views', 'views');
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use("/", homeRoute);
app.use("/song", songRoute);
app.use("/add", addRoute);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
    }, (err) => {
      if (err) {
        console.log(err);
      }
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const expHbs = require('express-handlebars');
const homeRoute = require("./routes/home");
const songRoute = require("./routes/song");
const addRoute = require("./routes/add");
const keys = require("./keys");

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
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "https:"],
      "script-src-elem": ["'self'", "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js", "'unsafe-inline'"]
    }
  }
}));
app.use(compression());

app.use("/", homeRoute);
app.use("/song", songRoute);
app.use("/add", addRoute);

const start = async () => {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
    }, (err) => {
      if (err) {
        console.log(err);
      }
    });
    app.listen(keys.PORT, () => {
      console.log(`Server is running on port ${keys.PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

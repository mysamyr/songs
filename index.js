const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const expHbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const homeRoute = require("./features/home");
const categoriesRoute = require("./features/categories");
const liturgyRoute = require("./features/liturgy");
const songRoute = require("./features/songs");
const authRoute = require("./features/auth");
const errorHandler = require("./utils/errorHandler");
const varMiddleware = require("./middleware/variables");
const keys = require("./keys");

const app = express();
const hbs = expHbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils/hbs.helpers"),
  allowProtoMethodsByDefault: true,
});
const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("views", "views");
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(varMiddleware);
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
app.use(flash());

app.use("/", homeRoute);
app.use("/categories", categoriesRoute);
app.use("/liturgy", liturgyRoute);
app.use("/song", songRoute);
app.use("/auth", authRoute);

app.use(errorHandler);

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

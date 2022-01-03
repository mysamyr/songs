const express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  helmet = require("helmet"),
  compression = require("compression"),
  expHbs = require("express-handlebars"),
  session = require("express-session"),
  MongoStore = require("connect-mongodb-session")(session),
  flash = require("connect-flash");
const homeRoute = require("./features/home"),
  categoryRoute = require("./features/category"),
  songRoute = require("./features/songs"),
  authRoute = require("./features/auth");
const keys = require("./keys");
const {variable, h404} = require("./middleware");

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
app.use(variable);
app.use(helmet());
app.use(compression());
app.use(flash());

app.use("/", homeRoute);
app.use("/category", categoryRoute);
app.use("/song", songRoute);
app.use("/auth", authRoute);

app.use(h404);

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

const express = require("express"),
  path = require("path"),
  mongoose = require("mongoose"),
  helmet = require("helmet"),
  compression = require("compression"),
  expHbs = require("express-handlebars"),
  cors = require("cors"),
  session = require("express-session"),
  MongoStore = require("connect-mongodb-session")(session),
  flash = require("connect-flash");
const homeRoute = require("./src/features/home"),
  categoryRoute = require("./src/features/category"),
  cabinetRoute = require("./src/features/cabinet"),
  songRoute = require("./src/features/songs"),
  authRoute = require("./src/features/auth");
const {
  PORT,
  MONGODB_URI,
  SESSION_SECRET,
} = require("./src/config");
const {variable, h404} = require("./src/middleware");

const app = express();
const hbs = expHbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./src/utils/hbs.helpers"),
  allowProtoMethodsByDefault: true,
});
const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("views", "views");
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cors({origin: "*"}));
app.use(compression());
app.use(flash());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(variable);

app.use("/", homeRoute);
app.use("/category", categoryRoute);
app.use("/song", songRoute);
app.use("/auth", authRoute);
app.use("/cabinet", cabinetRoute);

app.use(h404);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    }, (err) => {
      if (err) console.log(err);
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

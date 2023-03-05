const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const expHbs = require("express-handlebars");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const { COLLECTIONS } = require("./src/constants");
const {logger, errorLogger} = require("./src/services/logger");
const homeRoute = require("./src/features/home"),
  categoryRoute = require("./src/features/category"),
  cabinetRoute = require("./src/features/cabinet"),
  songRoute = require("./src/features/songs"),
  authRoute = require("./src/features/auth");
const {variable, h404, requestLoggerMiddleware, errorHandler} = require("./src/middleware");

const {
  PORT,
  MONGODB_URI,
  SESSION_SECRET,
} = require("./src/config");

const app = express();
const hbs = expHbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./src/utils/hbs.helpers"),
  allowProtoMethodsByDefault: true,
});
const store = new MongoStore({
  collection: COLLECTIONS.SESSION,
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
app.use(requestLoggerMiddleware);

app.use("/", homeRoute);
app.use("/category", categoryRoute);
app.use("/song", songRoute);
app.use("/auth", authRoute);
app.use("/cabinet", cabinetRoute);

app.use(errorHandler);

app.use(h404);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    }, (err) => {
      if (err) errorLogger(err.message);
    });
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    errorLogger(err.message);
  }
};

start();

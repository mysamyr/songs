import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import compression from "compression";
import expHbs from "express-handlebars";
import cors from "cors";
import session from "express-session";
import connectMongoSession from "connect-mongodb-session";
import flash from "connect-flash";

import { COLLECTIONS } from "./constants/index.js";
import config from "./utils/dotenv.js";
import { auth, cabinet, category, home, song } from "./routes/index.js";
import { logger } from "./services/logger.js";
import {
	variable,
	h404,
	requestLoggerMiddleware,
	errorHandler,
} from "./middlewares/index.js";
import * as helpers from "./utils/hbs.helpers.js";

config();
const MongoStore = connectMongoSession(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = +process.env.PORT;
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT || 5000;
const HEADERS_TIMEOUT = +process.env.HEADERS_TIMEOUT || 2000;
const KEEP_ALIVE_TIMEOUT = +process.env.KEEP_ALIVE_TIMEOUT || 3000;
const SERVER_TIMEOUT = +process.env.SERVER_TIMEOUT || 60000;

const app = express();

const hbs = expHbs.create({
	defaultLayout: "main",
	extname: "hbs",
	helpers,
	allowProtoMethodsByDefault: true,
});
const store = new MongoStore({
	collection: COLLECTIONS.SESSION,
	uri: process.env.MONGODB_URL,
});

app.engine("hbs", hbs.engine);
app.set("views", "views");
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
		store,
	}),
);
app.use(variable);
app.use(requestLoggerMiddleware);

app.get("/ping", (req, res) => {
	res.status(200).send();
});

app.use("/", home);
app.use("/category", category);
app.use("/song", song);
app.use("/auth", auth);
app.use("/cabinet", cabinet);

app.use(errorHandler);

app.use(h404);

const start = async () => {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(process.env.MONGODB_URL);
		const server = app.listen(PORT, () => {
			logger.info(`Server is running on port ${PORT}`);
		});

		server.requestTimeout = REQUEST_TIMEOUT;
		server.headersTimeout = HEADERS_TIMEOUT;
		server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT;
		server.setTimeout(SERVER_TIMEOUT);
	} catch (err) {
		logger.error(err.message);
	}
};

start();

process
	.on("unhandledRejection", (err) => {
		logger.error(err);
	})
	.on("uncaughtException", async (err) => {
		logger.error(err);
		logger.error("!= () APP shutdown ");
		await mongoose.disconnect();
		process.exit(1);
	})
	.on("SIGINT", async () => {
		logger.log("Received SIGINT. Closing connections...");
		await mongoose.disconnect();
		process.exit(0);
	})
	.on("SIGTERM", async () => {
		logger.log("Received SIGTERM. Closing connections...");
		await mongoose.disconnect();
		process.exit(0);
	});

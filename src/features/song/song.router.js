import Router from "express";
import { auth, promisify, isAccountValid } from "../../middlewares/index.js";
import {
	validateParams,
	defaultParams,
	validateQuery,
} from "../../validators/index.js";
import {
	addSongQuery,
	validateAddSong,
	validateEditSong,
} from "./song.validation.js";
import * as songController from "./song.controller.js";

const router = Router();

// Add new song
router.get(
	"/add",
	auth,
	isAccountValid,
	validateQuery(addSongQuery, "/category"),
	promisify(songController.renderAddSong),
);
router.post("/add", auth, validateAddSong, promisify(songController.addSong));

// Edit song
router.get(
	"/edit/:id",
	auth,
	isAccountValid,
	validateParams(defaultParams, "/category"),
	promisify(songController.renderEditSong),
);
router.post(
	"/edit/:id",
	auth,
	validateEditSong,
	promisify(songController.editSong),
);

// Delete song
router.get(
	"/delete/:id",
	auth,
	isAccountValid,
	validateParams(defaultParams, "/category"),
	promisify(songController.deleteSong),
);

// Get song
router.get(
	"/:id",
	validateParams(defaultParams, "/category"),
	promisify(songController.getSong),
);

export default router;

import Router from "express";
import { auth, promisify, isValid } from "../../middleware.js";
import {
	validateAddSong,
	validateParamsId,
	validateEditSong,
} from "../../validators/index.js";
import * as songController from "./song.controller.js";

const router = Router();

// Add new song
router.get("/add", auth, isValid, promisify(songController.renderAddSong));
router.post("/add", auth, validateAddSong, promisify(songController.addSong));

// Edit song
router.get(
	"/edit/:id",
	auth,
	isValid,
	validateParamsId("/category"),
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
	isValid,
	validateParamsId("/category"),
	promisify(songController.deleteSong),
);

// Get song
router.get(
	"/:id",
	validateParamsId("/category"),
	promisify(songController.getSong),
);

export default router;

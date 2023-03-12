const router = require("express").Router();
const { auth, promisify, isValid } = require("../../middleware");
const {
	validateAddSong,
	validateParamsId,
	validateEditSong,
} = require("../../validators");
const songController = require("./song.controller");

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

module.exports = router;

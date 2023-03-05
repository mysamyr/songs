const router = require("express").Router();
// const { Types } = require("mongoose");
const { TITLES } = require("../constants");
const {
	SUCCESS_DELETE_SONG,
	CREATE_SONG,
	EDIT_SONG,
} = require("../constants/messages");
const {
	NO_CATEGORIES,
	EXISTING_SONG,
	DELETED_CATEGORY,
	NOT_EXISTING_SONG,
	NOT_AUTHOR,
} = require("../constants/error-messages");
const { Song, Category } = require("../models");
const { auth, promisify, isValid } = require("../middleware");
const {
	validateAddSong,
	validateParamsId,
	validateEditSong,
} = require("../validators");
const { errorLogger } = require("../services/logger");
const { separateCategories } = require("../helpers/songs.helper");

// Add new song
router.get(
	"/add",
	auth,
	isValid,
	promisify(async (req, res) => {
		const { current, name, text } = req.query;

		const categories = await Category.find().select("name").exec();
		if (!categories.length) {
			errorLogger(NO_CATEGORIES);
			req.flash("err", NO_CATEGORIES);
			return res.redirect("/category");
		}

		return res.render("new_song", {
			title: TITLES.ADD_SONG,
			isSong: true,
			current,
			name,
			text,
			categories: categories.map((i) => i.toObject()),
			err: req.flash("err"),
		});
	}),
);
router.post(
	"/add",
	auth,
	validateAddSong,
	promisify(async (req, res) => {
		const {
			body: { categories, name, text },
			session: { user },
		} = req;
		const catArray = Array.isArray(categories) ? categories : [categories];

		const dbCategories = await Category.find({ name: catArray })
			.select("id name")
			.exec();
		if (!dbCategories.length || catArray.length !== dbCategories.length) {
			errorLogger(DELETED_CATEGORY);
			req.flash("err", DELETED_CATEGORY);
			return res.redirect("/song/add");
		}

		const isSongExist = await Song.findOne({
			name,
			deleted: false,
		});
		if (isSongExist) {
			errorLogger(EXISTING_SONG);
			req.flash("err", EXISTING_SONG);
			return res.redirect("/song/add");
		}

		const newSong = await Song.create({
			name,
			text,
			author: user.id,
			categories: dbCategories.map((i) => i._id),
		});

		req.flash("msg", CREATE_SONG);
		return res.redirect(`/song/${newSong.id}`);
	}),
);

// Edit song
router.get(
	"/edit/:id",
	auth,
	isValid,
	validateParamsId("/category"),
	promisify(async (req, res) => {
		const {
			params: { id },
			session: { user },
		} = req;

		const song = await Song.findOne({ _id: id })
			.select("name text author categories")
			.exec();
		if (!song) {
			errorLogger(NOT_EXISTING_SONG);
			req.flash("err", NOT_EXISTING_SONG);
			return res.redirect("/category");
		}
		if (!user.isAdmin && user.id !== song.author.toString()) {
			errorLogger(NOT_AUTHOR);
			req.flash("err", NOT_AUTHOR);
			return res.redirect(`/song/${id}`);
		}

		const allCategories = await Category.find().select("id name").exec();

		const { currents, categories } = separateCategories(allCategories, song);

		return res.render("edit_song", {
			title: TITLES.EDIT_SONG,
			isSong: true,
			id,
			name: song.name,
			text: song.text,
			currents,
			categories,
			err: req.flash("err"),
		});
	}),
);
router.post(
	"/edit/:id",
	auth,
	validateEditSong,
	promisify(async (req, res) => {
		const {
			params: { id },
			body: { categories, name, text },
			session: { user },
		} = req;

		const catArray = Array.isArray(categories) ? categories : [categories];

		const dbCategories = await Category.find({ name: catArray })
			.select("id")
			.exec();
		if (!dbCategories.length || catArray.length !== dbCategories.length) {
			errorLogger(DELETED_CATEGORY);
			req.flash("err", DELETED_CATEGORY);
			return res.redirect(`/song/edit/${id}`);
		}

		await Song.findOneAndUpdate(
			{ _id: id },
			{
				name,
				text,
				author: user.id,
				categories: dbCategories.map((c) => c._id),
			},
		);

		req.flash("msg", EDIT_SONG);
		return res.redirect(`/song/${id}`);
	}),
);

// Delete song
router.get(
	"/delete/:id",
	auth,
	isValid,
	validateParamsId("/category"),
	promisify(async (req, res) => {
		const {
			params: { id },
			session: { user },
		} = req;

		const song = await Song.findOne({ _id: id });
		if (!song) {
			errorLogger(NOT_EXISTING_SONG);
			req.flash("err", NOT_EXISTING_SONG);
			return res.redirect("/category");
		}
		if (!user.isAdmin && user.id !== song.author.toString()) {
			errorLogger(NOT_AUTHOR);
			req.flash("err", NOT_AUTHOR);
			return res.redirect(`/song/${id}`);
		}
		song.deleted = true;
		song.deleted_at = new Date();

		await song.save();

		req.flash("msg", SUCCESS_DELETE_SONG(song.name));
		return res.redirect("/category");
	}),
);

// Get song
router.get(
	"/:id",
	validateParamsId("/category"),
	promisify(async (req, res) => {
		const {
			params: { id },
			session: { user },
		} = req;

		const song = await Song.findOne({ _id: id })
			.select("id name text")
			.populate("author", "id name")
			.exec();
		if (!song) {
			errorLogger(NOT_EXISTING_SONG);
			req.flash("err", NOT_EXISTING_SONG);
			return res.redirect("/category");
		}
		const isAuthor = user && (user.isAdmin || user.id === song.author?.id);

		return res.render("song", {
			title: song.name,
			isSong: true,
			name: song.name,
			author: song.author?.name,
			text: song.text,
			id: song.id,
			msg: req.flash("msg"),
			err: req.flash("err"),
			isAuthor,
		});
	}),
);

module.exports = router;

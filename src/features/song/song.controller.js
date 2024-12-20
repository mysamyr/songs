import { TITLES } from "../../constants/index.js";
import {
	CREATE_SONG,
	EDIT_SONG,
	SUCCESS_DELETE_SONG,
} from "../../constants/messages.js";
import {
	DELETED_CATEGORY,
	EXISTING_SONG,
	NOT_EXISTING_SONG,
	NOT_AUTHOR,
	NO_CATEGORIES,
} from "../../constants/error-messages.js";
import { Category, Song } from "../../models/index.js";
import { logger } from "../../services/logger.js";
import { separateCategories } from "./song.helper.js";

export const renderAddSong = async (req, res) => {
	const { current, name, text } = req.validateQuery;

	const categories = await Category.find().select("name").exec();
	if (!categories.length) {
		logger.error(NO_CATEGORIES);
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
};

export const addSong = async (req, res) => {
	const {
		body: { categories, name, text },
		session: { user },
	} = req;
	const catArray = Array.isArray(categories) ? categories : [categories];

	const dbCategories = await Category.find({ name: catArray })
		.select("id name")
		.exec();
	if (!dbCategories.length || catArray.length !== dbCategories.length) {
		logger.error(DELETED_CATEGORY);
		req.flash("err", DELETED_CATEGORY);
		return res.redirect("/song/add");
	}

	const isSongExist = await Song.findOne({
		name,
		deleted: false,
	});
	if (isSongExist) {
		logger.error(EXISTING_SONG);
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
};

export const renderEditSong = async (req, res) => {
	const {
		params: { id },
		session: { user, isAdmin },
	} = req;

	const song = await Song.findOne({ _id: id })
		.select("name text author categories")
		.exec();
	if (!song) {
		logger.error(NOT_EXISTING_SONG);
		req.flash("err", NOT_EXISTING_SONG);
		return res.redirect("/category");
	}
	if (!isAdmin && user.id !== song.author.toString()) {
		logger.error(NOT_AUTHOR);
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
};

export const editSong = async (req, res) => {
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
		logger.error(DELETED_CATEGORY);
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
};

export const deleteSong = async (req, res) => {
	const {
		params: { id },
		session: { user, isAdmin },
	} = req;

	const song = await Song.findOne({ _id: id });
	if (!song) {
		logger.error(NOT_EXISTING_SONG);
		req.flash("err", NOT_EXISTING_SONG);
		return res.redirect("/category");
	}
	if (!isAdmin && user.id !== song.author.toString()) {
		logger.error(NOT_AUTHOR);
		req.flash("err", NOT_AUTHOR);
		return res.redirect(`/song/${id}`);
	}
	song.deleted = true;
	song.deleted_at = new Date();

	await song.save();

	req.flash("msg", SUCCESS_DELETE_SONG(song.name));
	return res.redirect("/category");
};

export const getSong = async (req, res) => {
	const {
		params: { id },
		session: { user },
	} = req;

	const song = await Song.findOne({ _id: id })
		.select("id name text")
		.populate("author", "id name")
		.exec();
	if (!song) {
		logger.error(NOT_EXISTING_SONG);
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
};

import { TITLES } from "../../constants/index.js";
import {
	SUCCESS_CREATE_CATEGORY,
	SUCCESS_DELETE_CATEGORY,
	SUCCESS_UPDATE_CATEGORY,
} from "../../constants/messages.js";
import {
	EXISTING_CATEGORY,
	SONGS_INSIDE_CATEGORY,
	NO_SUCH_CATEGORY,
	SAME_CATEGORY,
	NOT_AUTHOR,
} from "../../constants/error-messages.js";
import { Category, Song } from "../../models/index.js";
import { logger } from "../../services/logger.js";
import { capitalize, sortByName, mapCategories } from "./category.helper.js";

export const getCategories = async (req, res) => {
	const categories = await Category.find().select("id name").exec();

	return res.render("categories", {
		title: TITLES.MAIN,
		isSong: true,
		categories: mapCategories(categories),
		msg: req.flash("msg"),
		err: req.flash("err"),
	});
};

export const addCategory = async (req, res) => {
	const {
		body: { name },
		session: { user },
	} = req;

	const isCategoryNameExists = await Category.findOne({ name });
	if (isCategoryNameExists) {
		logger.error(EXISTING_CATEGORY);
		req.flash("err", EXISTING_CATEGORY);
		return res.redirect("/category/add");
	}

	await Category.create({
		name,
		author: user.id,
	});

	req.flash("msg", SUCCESS_CREATE_CATEGORY(name));
	return res.redirect("/category");
};

export const editCategory = async (req, res) => {
	const {
		body: { prevValue, newValue },
		params: { id },
		session: { user, isAdmin },
	} = req;

	if (prevValue === newValue) {
		logger.error(SAME_CATEGORY);
		return res.status(400).send();
	}

	const category = await Category.findById(id);
	if (!category) {
		logger.error(NO_SUCH_CATEGORY);
		req.flash("err", NO_SUCH_CATEGORY);
		return res.redirect(`/category/${id}`);
	}
	const isNewNameNotUnique = await Category.findOne({ name: newValue });
	if (isNewNameNotUnique) {
		logger.error(EXISTING_CATEGORY);
		req.flash("err", EXISTING_CATEGORY);
		return res.redirect(`/category/${id}`);
	}
	if (category.author.toString() !== user.id && !isAdmin) {
		logger.error(NOT_AUTHOR);
		req.flash("err", NOT_AUTHOR);
		return res.redirect(`/category/${id}`);
	}

	category.name = newValue;
	category.author = user.id;
	await category.save();

	req.flash("msg", SUCCESS_UPDATE_CATEGORY);
	return res.redirect(`/category/${id}`);
};

export const deleteCategory = async (req, res) => {
	const { id } = req.params;

	const isCategoryNotEmpty = await Song.findOne({
		categories: id,
		deleted: false,
	});

	if (isCategoryNotEmpty) {
		logger.error(SONGS_INSIDE_CATEGORY);
		req.flash("err", SONGS_INSIDE_CATEGORY);
		return res.redirect(`/category/${id}`);
	}
	const category = await Category.findOneAndDelete({
		_id: id,
	});

	req.flash("msg", SUCCESS_DELETE_CATEGORY(category.name));
	return res.redirect("/category");
};

export const getSongsForCategory = async (req, res) => {
	const {
		params: { id },
		session: { user },
	} = req;

	const songs = await Song.find({
		categories: id,
		deleted: false,
	})
		.select("name id")
		.exec();
	const dbCategory = await Category.findOne({
		_id: id,
	})
		.select("id name author")
		.exec();

	if (!dbCategory) {
		logger.error(NO_SUCH_CATEGORY);
		req.flash("err", NO_SUCH_CATEGORY);
		return res.redirect("/category");
	}
	const categoryName = capitalize(dbCategory.name);

	return res.render("category", {
		title: categoryName,
		isSong: true,
		categoryName,
		categoryId: dbCategory.id,
		isAuthor: dbCategory.author.toString() === user?.id,
		songs: sortByName(songs),
		err: req.flash("err"),
	});
};

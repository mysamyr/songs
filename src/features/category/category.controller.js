const { TITLES } = require("../../constants");
const {
	SUCCESS_CREATE_CATEGORY,
	SUCCESS_DELETE_CATEGORY,
	SUCCESS_UPDATE_CATEGORY,
} = require("../../constants/messages");
const {
	EXISTING_CATEGORY,
	SONGS_INSIDE_CATEGORY,
	NO_SUCH_CATEGORY,
	SAME_CATEGORY,
	NOT_AUTHOR,
} = require("../../constants/error-messages");
const { Category, Song } = require("../../models");
const { errorLogger } = require("../../services/logger");
const { capitalize, sortByName, mapCategories } = require("./category.helper");

module.exports.getCategories = async (req, res) => {
	const categories = await Category.find().select("id name").exec();

	return res.render("categories", {
		title: TITLES.MAIN,
		isSong: true,
		categories: mapCategories(categories),
		msg: req.flash("msg"),
		err: req.flash("err"),
	});
};

module.exports.addCategory = async (req, res) => {
	const {
		body: { name },
		session: { user },
	} = req;

	const isCategoryNameExists = await Category.findOne({ name });
	if (isCategoryNameExists) {
		errorLogger(EXISTING_CATEGORY);
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

module.exports.editCategory = async (req, res) => {
	const {
		body: { prevValue, newValue },
		params: { id },
		session: { user },
	} = req;

	if (prevValue === newValue) {
		errorLogger(SAME_CATEGORY);
		return res.status(400).send();
	}

	const category = await Category.findById(id);
	if (!category) {
		errorLogger(NO_SUCH_CATEGORY);
		req.flash("err", NO_SUCH_CATEGORY);
		return res.redirect(`/category/${id}`);
	}
	const isNewNameNotUnique = await Category.findOne({ name: newValue });
	if (isNewNameNotUnique) {
		errorLogger(EXISTING_CATEGORY);
		req.flash("err", EXISTING_CATEGORY);
		return res.redirect(`/category/${id}`);
	}
	if (category.author.toString() !== user.id) {
		errorLogger(NOT_AUTHOR);
		req.flash("err", NOT_AUTHOR);
		return res.redirect(`/category/${id}`);
	}

	category.name = newValue;
	await category.save();

	req.flash("msg", SUCCESS_UPDATE_CATEGORY);
	return res.redirect(`/category/${id}`);
};

module.exports.deleteCategory = async (req, res) => {
	const { id } = req.params;

	const isCategoryNotEmpty = await Song.findOne({
		categories: id,
		deleted: false,
	});

	if (isCategoryNotEmpty) {
		errorLogger(SONGS_INSIDE_CATEGORY);
		req.flash("err", SONGS_INSIDE_CATEGORY);
		return res.redirect(`/category/${id}`);
	}
	const category = await Category.findOneAndDelete({
		_id: id,
	});

	req.flash("msg", SUCCESS_DELETE_CATEGORY(category.name));
	return res.redirect("/category");
};

module.exports.getSongsForCategory = async (req, res) => {
	const { id } = req.params;

	const songs = await Song.find({
		categories: id,
		deleted: false,
	})
		.select("name id")
		.exec();
	const dbCategory = await Category.findOne({
		_id: id,
	})
		.select("id name")
		.exec();

	if (!dbCategory) {
		errorLogger(NO_SUCH_CATEGORY);
		req.flash("err", NO_SUCH_CATEGORY);
		return res.redirect("/category");
	}
	const categoryName = capitalize(dbCategory.name);

	return res.render("category", {
		title: categoryName,
		isSong: true,
		categoryName,
		categoryId: dbCategory.id,
		songs: sortByName(songs),
		err: req.flash("err"),
	});
};

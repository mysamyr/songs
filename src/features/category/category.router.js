const router = require("express").Router();
const { TITLES } = require("../../constants");
const { auth, promisify, isValid } = require("../../middleware");
const {
	validate,
	category,
	validateParamsId,
	validateEditCategory,
} = require("../../validators");
const categoryController = require("./category.controller");

// Categories
router.get("/", promisify(categoryController.getCategories));

// Add new category
router.get(
	"/add",
	auth,
	isValid,
	promisify((req, res) =>
		res.render("new_category", {
			title: TITLES.ADD_CATEGORY,
			isSong: true,
			err: req.flash("err"),
		}),
	),
);
router.post(
	"/add",
	auth,
	validate("body", category.body, "/category/add"),
	promisify(categoryController.addCategory),
);

router.post(
	"/edit/:id",
	auth,
	validateParamsId("/category"),
	validateEditCategory,
	promisify(categoryController.editCategory),
);

// Delete category
router.get(
	"/delete/:id",
	auth,
	isValid,
	validateParamsId("/category"),
	promisify(categoryController.deleteCategory),
);

// Show songs in category
router.get(
	"/:id",
	validateParamsId("/category"),
	promisify(categoryController.getSongsForCategory),
);

module.exports = router;

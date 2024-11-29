import Router from "express";
import { TITLES } from "../../constants/index.js";
import { auth, promisify, isAccountValid } from "../../middlewares/index.js";
import {
	validateBody,
	validateParams,
	defaultParams,
} from "../../validators/index.js";
import * as categoryController from "./category.controller.js";
import { categoryBody, validateEditCategory } from "./category.validation.js";

const router = Router();

// Categories
router.get("/", promisify(categoryController.getCategories));

// Add new category
router.get(
	"/add",
	auth,
	isAccountValid,
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
	validateBody(categoryBody, "/category/add"),
	promisify(categoryController.addCategory),
);

router.post(
	"/edit/:id",
	auth,
	validateParams(defaultParams, "/category"),
	validateEditCategory,
	promisify(categoryController.editCategory),
);

// Delete category
router.get(
	"/delete/:id",
	auth,
	isAccountValid,
	validateParams(defaultParams, "/category"),
	promisify(categoryController.deleteCategory),
);

// Show songs in category
router.get(
	"/:id",
	validateParams(defaultParams, "/category"),
	promisify(categoryController.getSongsForCategory),
);

export default router;

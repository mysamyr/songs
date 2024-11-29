import Router from "express";
import { TITLES } from "../../constants/index.js";
import { promisify } from "../../middlewares/index.js";

const router = Router();

// Home page
router.get(
	"/",
	promisify(async (req, res) =>
		res.render("index", {
			title: TITLES.HOME,
			isHome: true,
			email: process.env.SENDGRID_EMAIL,
			msg: req.flash("msg"),
			err: req.flash("err"),
		}),
	),
);

// Liturgy
router.get(
	"/lit",
	promisify(async (req, res) =>
		res.render("text", {
			title: TITLES.LITURGY,
			isLit: true,
		}),
	),
);

// Panachyda
router.get(
	"/pan",
	promisify(async (req, res) =>
		res.render("text", {
			title: TITLES.PANACHYDA,
			isPan: true,
		}),
	),
);

export default router;

const router = require("express").Router();
const { TITLES } = require("../../constants");
const { promisify } = require("../../middleware");

const { SENDGRID_EMAIL } = require("../../config");

// Home page
router.get(
	"/",
	promisify(async (req, res) =>
		res.render("index", {
			title: TITLES.HOME,
			isHome: true,
			email: SENDGRID_EMAIL,
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

module.exports = router;

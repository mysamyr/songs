const router = require("express").Router();
const { TITLES } = require("../../constants");
const { auth, promisify, noAuth } = require("../../middleware");
const { register, validate, login } = require("../../validators");
const authController = require("./auth.controller");

// login
router.get(
	"/login",
	noAuth,
	promisify((req, res) =>
		res.render("auth", {
			title: TITLES.LOGIN,
			isLogin: true,
			err: req.flash("err"),
			msg: req.flash("msg"),
		}),
	),
);
router.post(
	"/login",
	validate("body", login, "/auth/login#login"),
	promisify(authController.login),
);

// logout
router.get(
	"/logout",
	auth,
	promisify(async (req, res) => req.session.destroy(() => res.redirect("/"))),
);

// register
router.post(
	"/register",
	noAuth,
	validate("body", register, "/auth/login#register"),
	promisify(authController.register),
);

// verification
router.get("/verify/:id", promisify(authController.verify));

module.exports = router;

import Router from "express";
import { TITLES } from "../../constants/index.js";
import { auth, promisify, noAuth } from "../../middlewares/index.js";
import { validateBody } from "../../validators/index.js";
import { login, registration } from "./auth.validation.js";
import * as authController from "./auth.controller.js";

const router = Router();

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
	validateBody(login, "/auth/login#login"),
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
	validateBody(registration, "/auth/login#register"),
	promisify(authController.register),
);

// verification
router.get("/verify/:id", promisify(authController.verify));

export default router;

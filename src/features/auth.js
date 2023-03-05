const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { TITLES } = require("../constants");
const { SUCCESS, SUCCESS_LOGIN } = require("../constants/messages");
const {
	WRONG_EMAIL_OR_PASSWORD,
	EXISTING_USER,
	NOT_EXISTING_USER,
	PASSWORDS_NOT_MATCH,
	ALREADY_ACTIVATED,
	VERIFY_ERROR,
	LOGIN_ERROR,
} = require("../constants/error-messages");
const { User } = require("../models");
const { auth, promisify, noAuth } = require("../middleware");
const { register, validate, login } = require("../validators");
const { errorLogger } = require("../services/logger");
const { sendAuthorisationEmail } = require("../services/mail");
const { getLinkForVerification } = require("../helpers/user.helper");
const { getTimestampString } = require("../utils/time");

const { SENDGRID_EMAIL } = require("../config");

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
	promisify(async (req, res) => {
		const {
			body: { email, password },
			session,
		} = req;

		const candidate = await User.findOne({
			email,
		})
			.select("id name password verified is_admin")
			.exec();
		if (!candidate) {
			errorLogger(NOT_EXISTING_USER);
			req.flash("err", NOT_EXISTING_USER);
			return res.redirect("/auth/login#login");
		}

		const isSame = await bcrypt.compare(password, candidate.password);
		if (!isSame) {
			errorLogger(WRONG_EMAIL_OR_PASSWORD);
			req.flash("err", WRONG_EMAIL_OR_PASSWORD);
			return res.redirect("/auth/login#login");
		}

		session.user = {
			id: candidate.id,
			email,
			name: candidate.name,
		};
		session.isAuthenticated = true;
		session.isValidated = candidate.verified;
		session.isAdmin = candidate.is_admin;
		session.save((err) => {
			if (err) {
				errorLogger(err.message);
				req.flash("err", LOGIN_ERROR);
				return res.redirect("/");
			}
			req.flash("msg", SUCCESS_LOGIN);
			return res.redirect("/");
		});
	}),
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
	promisify(async (req, res) => {
		const { name, email, password, confirm } = req.body;
		if (password !== confirm) {
			errorLogger(PASSWORDS_NOT_MATCH);
			req.flash("err", PASSWORDS_NOT_MATCH);
			return res.status(422).redirect("/auth/login#register");
		}
		const candidate = await User.findOne({ email });
		if (candidate) {
			errorLogger(EXISTING_USER);
			req.flash("err", EXISTING_USER);
			return res.status(422).redirect("/auth/login#register");
		}

		const hashPassword = await bcrypt.hash(password, +process.env.HASH_SALT);
		// use timestamp as link for account verification
		const link = getTimestampString();
		await User.create({
			email,
			name,
			password: hashPassword,
			link,
		});

		await sendAuthorisationEmail({
			email,
			name,
			url: getLinkForVerification(link),
		});

		req.flash("msg", SUCCESS);
		return res.redirect("/auth/login#login");
	}),
);

// verification
router.get(
	"/verify/:id",
	promisify(async (req, res) => {
		const {
			params: { id },
			session,
		} = req;

		if (session.isValidated) {
			errorLogger(ALREADY_ACTIVATED);
			req.flash("err", ALREADY_ACTIVATED);
			return res.redirect("/");
		}
		const candidate = await User.findOneAndUpdate(
			{ link: id },
			{ verified: true },
			{ new: true },
		);
		if (!candidate) {
			errorLogger(VERIFY_ERROR);
			return res.render("verified", {
				title: VERIFY_ERROR,
				email: SENDGRID_EMAIL,
			});
		}

		session.isValidated = true;
		session.save(async (err) => {
			if (err) return errorLogger(err.message);
			return res.render("verified", {
				title: TITLES.GREETINGS,
				name: candidate.name,
			});
		});
	}),
);

module.exports = router;

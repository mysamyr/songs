const { TITLES } = require("../../constants");
const { SUCCESS_LOGIN, SUCCESS } = require("../../constants/messages");
const {
	NOT_EXISTING_USER,
	WRONG_EMAIL_OR_PASSWORD,
	LOGIN_ERROR,
	PASSWORDS_NOT_MATCH,
	EXISTING_USER,
	ALREADY_ACTIVATED,
	VERIFY_ERROR,
} = require("../../constants/error-messages");
const { User } = require("../../models");
const { errorLogger } = require("../../services/logger");
const { sendAuthorisationEmail } = require("../../services/mail");
const { getLinkForVerification } = require("../cabinet/cabinet.helper");
const { getTimestampString } = require("../../utils/time");

const { SENDGRID_EMAIL } = require("../../config");
const { compare, hash } = require("../../utils/crypto");

module.exports.login = async (req, res) => {
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

	const isSame = compare(password, candidate.password);
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
};

module.exports.register = async (req, res) => {
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

	const hashPassword = hash(password);
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
};

module.exports.verify = async (req, res) => {
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
};

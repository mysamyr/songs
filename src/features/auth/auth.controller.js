import { TITLES } from "../../constants/index.js";
import { SUCCESS_LOGIN, SUCCESS } from "../../constants/messages.js";
import {
	NOT_EXISTING_USER,
	WRONG_EMAIL_OR_PASSWORD,
	LOGIN_ERROR,
	PASSWORDS_NOT_MATCH,
	EXISTING_USER,
	ALREADY_ACTIVATED,
	VERIFY_ERROR,
} from "../../constants/error-messages.js";
import { User } from "../../models/index.js";
import { logger } from "../../services/logger.js";
import { sendAuthorisationEmail } from "../../services/mail.js";
import { getLinkForVerification } from "../cabinet/cabinet.helper.js";
import { compare, hash, uuid } from "../../utils/crypto.js";

export const login = async (req, res) => {
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
		logger.error(NOT_EXISTING_USER);
		req.flash("err", NOT_EXISTING_USER);
		return res.redirect("/auth/login#login");
	}

	const isSame = compare(password, candidate.password);
	if (!isSame) {
		logger.error(WRONG_EMAIL_OR_PASSWORD);
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
			logger.error(err.message);
			req.flash("err", LOGIN_ERROR);
			return res.redirect("/");
		}
		req.flash("msg", SUCCESS_LOGIN);
		return res.redirect("/");
	});
};

export const register = async (req, res) => {
	const { name, email, password, confirm } = req.body;
	if (password !== confirm) {
		logger.error(PASSWORDS_NOT_MATCH);
		req.flash("err", PASSWORDS_NOT_MATCH);
		return res.status(422).redirect("/auth/login#register");
	}
	const candidate = await User.findOne({ email });
	if (candidate) {
		logger.error(EXISTING_USER);
		req.flash("err", EXISTING_USER);
		return res.status(422).redirect("/auth/login#register");
	}

	const hashPassword = hash(password);
	const link = uuid();
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

export const verify = async (req, res) => {
	const {
		params: { id },
		session,
	} = req;

	if (session.isValidated) {
		logger.error(ALREADY_ACTIVATED);
		req.flash("err", ALREADY_ACTIVATED);
		return res.redirect("/");
	}
	const candidate = await User.findOneAndUpdate(
		{ link: id },
		{ verified: true },
		{ new: true },
	);
	if (!candidate) {
		logger.error(VERIFY_ERROR);
		return res.render("verified", {
			title: VERIFY_ERROR,
			email: process.env.SEND_EMAIL,
		});
	}

	session.isValidated = true;
	session.save(async (err) => {
		if (err) return logger.error(err.message);
		return res.render("verified", {
			title: TITLES.GREETINGS,
			name: candidate.name,
		});
	});
};

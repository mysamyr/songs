const Joi = require("joi");
const { errorLogger } = require("../services/logger");
const { makeAddSongUrlAfterError } = require("../helpers/songs.helper");

const email = Joi.string().email().required().messages({
	"any.required": "Введіть email",
	"string.empty": "Введіть email",
	"string.email": "Невірний email",
});
const password = Joi.string().trim().min(8).max(30).required().messages({
	"any.required": "Введіть пароль",
	"string.empty": "Введіть пароль",
	"string.min": "Мінімальна довжина паролю - 8 символів",
	"string.max": "Пароль не може бути довшим 30-ти символів",
});
const category = Joi.string().trim().lowercase().min(5).max(30).required();
const params = Joi.object({
	id: Joi.string().hex().length(24).required().messages({
		"string.empty": "Невірний ідентифікатор",
		"string.hex": "Невірний ідентифікатор",
		"string.length": "Невірний ідентифікатор",
	}),
});
const song = Joi.object({
	categories: [
		Joi.array()
			.items(
				category.messages({
					"any.required": "Виберіть категорію",
					"string.empty": "Невірна категорія",
					"string.min": "Виберіть іншу категорію, будь ласка",
					"string.max": "Виберіть іншу категорію, будь ласка",
				}),
			)
			.required(),
		category.messages({
			"any.required": "Виберіть категорію",
			"string.empty": "Невірна категорія",
			"string.min": "Виберіть іншу категорію, будь ласка",
			"string.max": "Виберіть іншу категорію, будь ласка",
		}),
	],
	name: Joi.string().trim().min(4).max(30).required().messages({
		"any.required": "Введіть назву пісні",
		"string.empty": "Назва пісні не можу бути пустою",
		"string.min": "Назва пісні має містити як мінімум 4 символи",
		"string.max": "Назва пісні занадто довга",
	}),
	text: Joi.string().required().messages({
		"any.required": "Введіть текст пісні",
		"string.empty": "Текст пісні не можу бути пустим",
	}),
});

module.exports = {
	validate: (entity, schema, url) => {
		return (req, res, next) => {
			const { error, value } = schema.validate(req[entity]);
			if (!error) {
				req[entity] = value;
				return next();
			}

			const message = error.details[0].message;
			errorLogger(message);
			req.flash("err", message);
			return res.redirect(url);
		};
	},
	validateParamsId: (url) => {
		return (req, res, next) => {
			const { error } = params.validate(req.params);
			if (!error) return next();

			const message = error.details[0].message;
			errorLogger(message);
			req.flash("err", message);
			return res.redirect(url);
		};
	},
	validateAddSong: (req, res, next) => {
		const { error, value } = song.validate(req.body);
		if (!error) {
			req.body = value;
			return next();
		}

		const message = error.details[0].message;
		errorLogger(message);
		req.flash("err", message);
		const url = makeAddSongUrlAfterError(req.body);
		return res.redirect(url);
	},
	validateEditSong: (req, res, next) => {
		const { error: idError } = params.validate(req.params);
		const { error: bodyError, value } = song.validate(req.body);
		const errors = [];
		for (let err of [idError, bodyError]) {
			if (err) {
				errors.push(err.details[0].message);
			}
		}
		if (!errors.length) {
			req.body = value;
			return next();
		}

		const message = errors[0];
		errorLogger(message);
		req.flash("err", message);
		return res.redirect(`/song/edit/${req.params.id}`);
	},
	login: Joi.object({
		email,
		password,
	}),
	register: Joi.object({
		name: Joi.string().trim().min(3).max(30).required().messages({
			"any.required": "Введіть імʼя",
			"string.empty": "Введіть імʼя",
			"string.min": "Імʼя занадто коротке",
			"string.max": "Імʼя занадто довге",
		}),
		email,
		password,
		confirm: Joi.ref("password"),
	}),
	category: {
		body: Joi.object({
			name: category.messages({
				"any.required": "Введіть назву категорії",
				"string.empty": "Введіть назву категорії",
				"string.min": "Введіть щонайменше 5 символів",
				"string.max": "Назва категорії занадто довга",
			}),
		}).required(),
	},
	changeEmail: {
		body: Joi.object({
			email,
		}).required(),
	},
	changePassword: {
		body: Joi.object({
			password,
			newPassword: password,
			confirm: Joi.ref("newPassword"),
		}).required(),
	},
};

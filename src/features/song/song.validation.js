import Joi from "joi";
import { logger } from "../../services/logger.js";
import { makeAddSongUrlAfterError } from "./song.helper.js";
import { categorySchema, defaultParams } from "../../validators/index.js";

const song = Joi.object({
	categories: [
		Joi.array()
			.items(
				categorySchema.messages({
					"any.required": "Виберіть категорію",
					"string.empty": "Невірна категорія",
					"string.min": "Виберіть іншу категорію, будь ласка",
					"string.max": "Виберіть іншу категорію, будь ласка",
				}),
			)
			.required(),
		categorySchema.messages({
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

export const addSongQuery = Joi.object({
	current: Joi.string().trim().optional(),
	name: Joi.string().trim().optional(),
	text: Joi.string().trim().optional(),
});

export const validateAddSong = (req, res, next) => {
	const { error, value } = song.validate(req.body);
	if (!error) {
		req.body = value;
		return next();
	}

	const message = error.details[0].message;
	logger.error(message);
	req.flash("err", message);
	const url = makeAddSongUrlAfterError(req.body);
	return res.redirect(url);
};

export const validateEditSong = (req, res, next) => {
	const { error: idError } = defaultParams.validate(req.params);
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
	logger.error(message);
	req.flash("err", message);
	return res.redirect(`/song/edit/${req.params.id}`);
};

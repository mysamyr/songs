import Joi from "joi";
import { logger } from "../services/logger.js";

export const defaultParams = Joi.object({
	id: Joi.string().hex().length(24).required().messages({
		"string.empty": "Невірний ідентифікатор",
		"string.hex": "Невірний ідентифікатор",
		"string.length": "Невірний ідентифікатор",
	}),
});
export const email = Joi.string().email().required().messages({
	"any.required": "Введіть email",
	"string.empty": "Введіть email",
	"string.email": "Невірний email",
});
export const password = Joi.string().trim().min(8).max(30).required().messages({
	"any.required": "Введіть пароль",
	"string.empty": "Введіть пароль",
	"string.min": "Мінімальна довжина паролю - 8 символів",
	"string.max": "Пароль не може бути довшим 30-ти символів",
});
export const categorySchema = Joi.string()
	.trim()
	.lowercase()
	.min(5)
	.max(30)
	.required();

const validate = (entity, schema, url) => (req, res, next) => {
	const { error, value } = schema.validate(req[entity]);
	if (!error) {
		if (entity === "query") {
			req.validateQuery = value;
		} else {
			req[entity] = value;
		}
		return next();
	}

	const message = error.details[0].message;
	logger.error(message);
	req.flash("err", message);
	return res.redirect(url);
};

export const validateParams = (schema, url) => (req, res, next) =>
	validate("params", schema, url)(req, res, next);

export const validateBody = (schema, url) => (req, res, next) =>
	validate("body", schema, url)(req, res, next);

export const validateQuery = (schema, url) => (req, res, next) =>
	validate("query", schema, url)(req, res, next);

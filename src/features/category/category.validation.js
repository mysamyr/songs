import Joi from "joi";
import { logger } from "../../services/logger.js";
import { categorySchema } from "../../validators/index.js";

const editCategory = Joi.object({
	prevValue: categorySchema,
	newValue: categorySchema,
});

export const validateEditCategory = (req, res, next) => {
	const { error, value } = editCategory.validate(req.body);
	if (!error) {
		req.body = value;
		return next();
	}

	const message = error.details[0].message;
	logger.error(message);
	return res.status(400).send();
};

export const categoryBody = Joi.object({
	name: categorySchema.messages({
		"any.required": "Введіть назву категорії",
		"string.empty": "Введіть назву категорії",
		"string.min": "Введіть щонайменше 5 символів",
		"string.max": "Назва категорії занадто довга",
	}),
}).required();

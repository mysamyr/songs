import Joi from "joi";
import { email, password } from "../../validators/index.js";

export const login = Joi.object({
	email,
	password,
});

export const registration = Joi.object({
	name: Joi.string().trim().min(3).max(30).required().messages({
		"any.required": "Введіть імʼя",
		"string.empty": "Введіть імʼя",
		"string.min": "Імʼя занадто коротке",
		"string.max": "Імʼя занадто довге",
	}),
	email,
	password,
	confirm: Joi.ref("password"),
});

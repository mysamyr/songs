import Joi from "joi";
import { email, password } from "../../validators/index.js";

export const changeEmail = {
	body: Joi.object({
		email,
	}).required(),
};

export const changePassword = {
	body: Joi.object({
		password,
		newPassword: password,
		confirm: Joi.ref("newPassword"),
	}).required(),
};

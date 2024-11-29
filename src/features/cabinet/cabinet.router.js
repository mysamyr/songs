import Router from "express";
import { TITLES } from "../../constants/index.js";
import { auth, promisify } from "../../middlewares/index.js";
import { validateBody } from "../../validators/index.js";
import { changeEmail, changePassword } from "./cabinet.validation.js";
import * as cabinetController from "./cabinet.controller.js";

const router = Router();

router.get(
	"/",
	auth,
	promisify(async (req, res) => {
		const { user, isValidated } = req.session;

		return res.render("cabinet", {
			title: TITLES.CABINET,
			isCab: true,
			user,
			isValidated,
			err: req.flash("err"),
			msg: req.flash("msg"),
		});
	}),
);
router.post(
	"/email",
	auth,
	validateBody(changeEmail.body, "/cabinet"),
	promisify(cabinetController.changeEmail),
);
router.post(
	"/password",
	auth,
	validateBody(changePassword.body, "/cabinet"),
	promisify(cabinetController.changePassword),
);
router.get("/resend", auth, promisify(cabinetController.resendVerification));

router.get("/delete", auth, promisify(cabinetController.deleteAccount));

export default router;

const router = require("express").Router();
const { TITLES } = require("../../constants");
const { auth, promisify } = require("../../middleware");
const { changeEmail, changePassword, validate } = require("../../validators");
const cabinetController = require("./cabinet.controller");

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
	validate("body", changeEmail.body, "/cabinet"),
	promisify(cabinetController.changeEmail),
);
router.post(
	"/password",
	auth,
	validate("body", changePassword.body, "/cabinet"),
	promisify(cabinetController.changePassword),
);
router.get("/resend", auth, promisify(cabinetController.resendVerification));

module.exports = router;

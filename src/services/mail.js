const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY, SENDGRID_EMAIL } = require("../config");

sgMail.setApiKey(SENDGRID_API_KEY);

const generateMail = (email, subject, text) => ({
	from: SENDGRID_EMAIL,
	to: email,
	subject,
	text,
});

module.exports.sendAuthorisationEmail = async ({ email, name, url }) => {
	return await sgMail.send(
		generateMail(
			email,
			"Вітаю на сайті пісеннику!",
			`Вітаю, ${name}. Щоб мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш обліковий запис.
      Посилання для активації: ${url} .
      Приємного користування сайтом!`,
		),
	);
};

module.exports.sendUpdateEmail = async ({ email, name, url }) => {
	return await sgMail.send(
		generateMail(
			email,
			"Пошту успішно змінено!",
			`Вітаю, ${name}. Щоб знову мати можливість створювати, редагувати чи видаляти пісні, активуйте Ваш новий email.
      Посилання для активації: ${url} .
      Дякую, що користуєтесь сайтом!`,
		),
	);
};

module.exports.sendUpdatePassword = async (email) => {
	return await sgMail.send(
		generateMail(
			email,
			"Ваш пароль до сайту Пісенник було змінено",
			`Якщо це Ви міняли пароль - просто проігноруйте даний лист.
      Якщо ж пароль був змінений не Вами - повідомте адміністрацію.
      Ви можете зв'язатися просто відповівши на це повідомлення.`,
		),
	);
};
